import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

type TextContent = { type: "text"; text: string };
type ResourceContent = {
  type: "resource";
  resource: { mimeType: string; blob: string; uri: string };
};
type ToolContent = TextContent | ResourceContent;

function content(result: unknown): ToolContent[] {
  return (result as { content: ToolContent[] }).content;
}

const ROOT = join(import.meta.dir, "../..");
const ENTRY = join(ROOT, "dist/src/index.js");
const PRELOAD = join(ROOT, "tests/e2e/fixtures-preload.mjs");

let client: Client;
let transport: StdioClientTransport;
let stderrOutput = "";

beforeAll(async () => {
  transport = new StdioClientTransport({
    command: "node",
    args: ["--import", PRELOAD, ENTRY],
    env: { ...process.env, MCP_TEST_MOCK: "1" } as Record<string, string>,
    stderr: "pipe",
  });

  // transport.stderr is a PassThrough created before connect — subscribe immediately
  transport.stderr?.on("data", (d: Buffer) => {
    stderrOutput += d.toString();
  });

  client = new Client({ name: "test-client", version: "0.0.0" });
  await client.connect(transport);

  await new Promise((r) => setTimeout(r, 300));
});

afterAll(async () => {
  await client?.close();
});

describe("MCP server E2E", () => {
  it("server starts and emits ready message on stderr", () => {
    expect(stderrOutput).toContain("running");
  });

  it("server name and version match package.json", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8")) as {
      name: string;
      version: string;
    };
    const info = client.getServerVersion();
    expect(info?.name).toBe(pkg.name);
    expect(info?.version).toBe(pkg.version);
  });

  it("tools/list returns all expected tools", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name);

    expect(names).toContain("get-terminals");
    expect(names).toContain("get-frequently-asked-questions");
    expect(names).toContain("get-arrival-terminals");
    expect(names).toContain("get-departure-schedules");
    expect(names).toContain("get-latest-purchased-tickets");
    expect(names).toContain("get-ticket-pdf");
  });

  it("tools/list includes inputSchema for parameterized tools", async () => {
    const { tools } = await client.listTools();
    const schedTool = tools.find((t) => t.name === "get-departure-schedules");
    expect(schedTool).toBeDefined();
    expect(schedTool?.inputSchema).toBeDefined();
  });

  it("get-terminals returns a non-empty array of terminals", async () => {
    const result = await client.callTool({ name: "get-terminals", arguments: {} });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    const terminals = JSON.parse(item.text);
    expect(Array.isArray(terminals)).toBe(true);
    expect(terminals.length).toBeGreaterThan(0);
    expect(terminals[0]).toHaveProperty("Id");
  });

  it("get-frequently-asked-questions returns a non-empty array of FAQs", async () => {
    const result = await client.callTool({
      name: "get-frequently-asked-questions",
      arguments: {},
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    const faqs = JSON.parse(item.text);
    expect(Array.isArray(faqs)).toBe(true);
    expect(faqs.length).toBeGreaterThan(0);
  });

  it("get-arrival-terminals returns terminals for a departure id", async () => {
    const result = await client.callTool({
      name: "get-arrival-terminals",
      arguments: { departureTerminalId: "001" },
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    const terminals = JSON.parse(item.text);
    expect(Array.isArray(terminals)).toBe(true);
    expect(terminals.length).toBeGreaterThan(0);
  });

  it("get-departure-schedules returns schedules for given terminals and date", async () => {
    const result = await client.callTool({
      name: "get-departure-schedules",
      arguments: {
        departureTerminalId: "001",
        arrivalTerminalId: "003",
        date: "23/03/2026",
      },
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    const schedules = JSON.parse(item.text);
    expect(Array.isArray(schedules)).toBe(true);
  });

  it("get-departure-schedules defaults to today when date is omitted", async () => {
    const result = await client.callTool({
      name: "get-departure-schedules",
      arguments: { departureTerminalId: "001", arrivalTerminalId: "003" },
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    expect(() => JSON.parse(item.text)).not.toThrow();
  });

  it("get-latest-purchased-tickets returns tickets for DNI and email", async () => {
    const result = await client.callTool({
      name: "get-latest-purchased-tickets",
      arguments: { DNI: "12345678", email: "test@test.com" },
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    const tickets = JSON.parse(item.text);
    expect(Array.isArray(tickets)).toBe(true);
  });

  it("get-ticket-pdf returns a base64 PDF resource", async () => {
    const result = await client.callTool({
      name: "get-ticket-pdf",
      arguments: { ticketCode: "ABC123" },
    });
    const item = content(result)[0] as ResourceContent;

    expect(item.type).toBe("resource");
    expect(item.resource.mimeType).toBe("application/pdf");
    expect(typeof item.resource.blob).toBe("string");
    expect(item.resource.uri).toContain("ABC123");
  });
});
