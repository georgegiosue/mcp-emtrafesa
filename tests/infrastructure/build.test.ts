import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

type TextContent = { type: "text"; text: string };
type ResourceContent = {
  type: "resource";
  resource: { mimeType: string; blob: string; uri: string };
};
type ToolContent = TextContent | ResourceContent;

function content(result: unknown): ToolContent[] {
  return (result as { content: ToolContent[] }).content;
}

function structured<T>(result: unknown, key: string): T[] {
  return (result as { structuredContent: Record<string, T[]> })
    .structuredContent[key];
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
    expect(stderrOutput).toContain("listening on stdio");
  });

  it("server name and version match package.json", () => {
    const pkg = JSON.parse(
      readFileSync(join(ROOT, "package.json"), "utf-8"),
    ) as {
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

  it("every tool advertises a title and read-only annotations", async () => {
    const { tools } = await client.listTools();

    for (const tool of tools) {
      expect(tool.title).toBeTruthy();
      expect(tool.annotations?.readOnlyHint).toBe(true);
      expect(tool.annotations?.destructiveHint).toBe(false);
      expect(tool.annotations?.openWorldHint).toBe(true);
    }
  });

  it("marks get-departure-schedules as non-idempotent", async () => {
    const { tools } = await client.listTools();
    const schedTool = tools.find((t) => t.name === "get-departure-schedules");

    expect(schedTool?.annotations?.idempotentHint).toBe(false);
  });

  it("advertises outputSchema for the structured-data tools", async () => {
    const { tools } = await client.listTools();

    for (const name of [
      "get-terminals",
      "get-arrival-terminals",
      "get-departure-schedules",
      "get-frequently-asked-questions",
      "get-latest-purchased-tickets",
    ]) {
      expect(tools.find((t) => t.name === name)?.outputSchema).toBeDefined();
    }
  });

  it("serves server instructions describing the tool chain", () => {
    const instructions = client.getInstructions();

    expect(instructions).toContain("get-terminals");
    expect(instructions).toContain("get-arrival-terminals");
    expect(instructions).toContain("get-departure-schedules");
  });

  it("get-terminals returns a non-empty array of terminals", async () => {
    const result = await client.callTool({
      name: "get-terminals",
      arguments: {},
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    const terminals = structured<Record<string, string>>(result, "terminals");
    expect(Array.isArray(terminals)).toBe(true);
    expect(terminals.length).toBeGreaterThan(0);
    expect(terminals[0]).toEqual({
      name: expect.any(String),
      address: expect.any(String),
    });
  });

  it("get-frequently-asked-questions returns a non-empty array of FAQs", async () => {
    const result = await client.callTool({
      name: "get-frequently-asked-questions",
      arguments: {},
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    expect(JSON.parse(item.text)).toEqual(result.structuredContent);

    const faqs = structured(result, "faqs");
    expect(Array.isArray(faqs)).toBe(true);
    expect(faqs.length).toBeGreaterThan(0);
  });

  it("get-arrival-terminals resolves the origin city by name", async () => {
    const result = await client.callTool({
      name: "get-arrival-terminals",
      arguments: { from: "Trujillo" },
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    const terminals = structured(result, "arrivalTerminals");
    expect(Array.isArray(terminals)).toBe(true);
    expect(terminals.length).toBeGreaterThan(0);
  });

  it("get-departure-schedules returns schedules for given terminals and date", async () => {
    const result = await client.callTool({
      name: "get-departure-schedules",
      arguments: {
        from: "Trujillo",
        to: "Cajamarca",
        date: "23/03/2026",
      },
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");

    const schedules = structured<{ departsAt: string }>(result, "schedules");
    expect(Array.isArray(schedules)).toBe(true);
    for (const schedule of schedules) {
      expect(schedule.departsAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    }
  });

  it("get-departure-schedules defaults to today when date is omitted", async () => {
    const result = await client.callTool({
      name: "get-departure-schedules",
      arguments: { from: "Trujillo", to: "Cajamarca" },
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    expect(Array.isArray(structured(result, "schedules"))).toBe(true);
  });

  it("get-latest-purchased-tickets returns tickets for DNI and email", async () => {
    const result = await client.callTool({
      name: "get-latest-purchased-tickets",
      arguments: { DNI: "12345678", email: "test@test.com" },
    });
    const item = content(result)[0] as TextContent;

    expect(item.type).toBe("text");
    expect(JSON.parse(item.text)).toEqual(result.structuredContent);
    expect(Array.isArray(structured(result, "tickets"))).toBe(true);
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
