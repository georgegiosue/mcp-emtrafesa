import { afterEach, describe, expect, it, mock } from "bun:test";
import worker from "../../src/worker";
import { mockFetch } from "../helpers/fetch";
import { expected, loadText } from "../helpers/fixtures";

const ENDPOINT = "http://worker.test/mcp";

function post(body: unknown): Request {
  return new Request(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      "mcp-protocol-version": "2025-06-18",
    },
    body: JSON.stringify(body),
  });
}

async function rpc<T>(body: unknown): Promise<T> {
  const response = await worker.fetch(post(body));

  expect(response.status).toBe(200);
  expect(response.headers.get("access-control-allow-origin")).toBe("*");

  const payload = (await response.text())
    .split("\n")
    .find((line) => line.startsWith("data:"));

  if (!payload) throw new Error("no SSE data frame in response");

  return JSON.parse(payload.slice("data:".length)).result as T;
}

const initialize = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "worker-test", version: "0.0.0" },
  },
};

describe("Cloudflare Worker entry", () => {
  afterEach(() => {
    mock.restore();
  });

  it("serves initialize with the package identity", async () => {
    const result = await rpc<{
      serverInfo: { name: string; version: string };
      instructions: string;
    }>(initialize);

    expect(result.serverInfo.name).toBe("mcp-emtrafesa");
    expect(result.instructions).toContain("Emtrafesa");
  });

  it("registers every tool on the remote transport", async () => {
    const result = await rpc<{ tools: { name: string }[] }>({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {},
    });

    expect(result.tools.map((tool) => tool.name).sort()).toEqual([
      "get-arrival-terminals",
      "get-available-seats",
      "get-departure-schedules",
      "get-frequently-asked-questions",
      "get-latest-purchased-tickets",
      "get-terminals",
      "get-ticket-pdf",
    ]);
  });

  it("runs a tool call through the HTTP repository", async () => {
    mockFetch(loadText("GetSucursales.json"));

    const result = await rpc<{
      structuredContent: { terminals: { name: string }[] };
    }>({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "get-terminals", arguments: {} },
    });

    expect(result.structuredContent.terminals).toHaveLength(
      expected.terminalCount,
    );
    expect(result.structuredContent.terminals[0]).toEqual({
      name: expected.firstTerminal.name,
      address: expected.firstTerminal.address,
    });
  });

  it("answers preflight with the CORS contract", async () => {
    const response = await worker.fetch(
      new Request(ENDPOINT, { method: "OPTIONS" }),
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-methods")).toContain(
      "POST",
    );
    expect(response.headers.get("access-control-allow-headers")).toContain(
      "mcp-session-id",
    );
  });

  it("reports identity on the health route", async () => {
    const response = await worker.fetch(new Request("http://worker.test/"));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      name: "mcp-emtrafesa",
      endpoint: "/mcp",
    });
  });

  it("404s any other route", async () => {
    const response = await worker.fetch(new Request("http://worker.test/sse"));

    expect(response.status).toBe(404);
  });
});
