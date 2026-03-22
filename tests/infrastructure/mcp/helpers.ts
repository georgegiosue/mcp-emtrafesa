import { mock } from "bun:test";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EmtrafesaRepository } from "../../../src/domain/ports/emtrafesa.repository";
import { registerTools } from "../../../src/infrastructure/mcp/tools";

type ToolHandler = (...args: unknown[]) => Promise<unknown>;
export type Tools = Record<string, { handler: ToolHandler }>;

export function createMockRepository(
  overrides: Partial<EmtrafesaRepository> = {},
): EmtrafesaRepository {
  return {
    getTerminals: mock(() => Promise.resolve([])),
    getFrequentlyAskedQuestions: mock(() => Promise.resolve([])),
    getArrivalTerminalsByDepartureTerminal: mock(() => Promise.resolve([])),
    getDepartureSchedules: mock(() => Promise.resolve([])),
    getLatestPurchaseTickets: mock(() => Promise.resolve([])),
    downloadTicketPDF: mock(() => Promise.resolve(Buffer.from(""))),
    ...overrides,
  };
}

export function buildTools(repo: EmtrafesaRepository): Tools {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerTools(server, repo);
  return (server as unknown as { _registeredTools: Tools })._registeredTools;
}

/** Creates a fresh repo+tools pair, optionally overriding specific methods. */
export function withRepo(overrides: Partial<EmtrafesaRepository> = {}): {
  repo: EmtrafesaRepository;
  tools: Tools;
} {
  const repo = createMockRepository(overrides);
  const tools = buildTools(repo);
  return { repo, tools };
}
