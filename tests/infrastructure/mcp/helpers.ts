import { mock } from "bun:test";
import { McpServer } from "@modelcontextprotocol/server";
import type { EmtrafesaRepository } from "../../../src/domain/ports/emtrafesa.repository";
import { registerTools } from "../../../src/infrastructure/mcp/tools";

type ToolHandler = (...args: unknown[]) => Promise<unknown>;
export type Tools = Record<string, { handler: ToolHandler }>;

function createMockRepository(
  overrides: Partial<EmtrafesaRepository> = {},
): EmtrafesaRepository {
  return {
    getTerminals: mock(() => Promise.resolve([])),
    getFrequentlyAskedQuestions: mock(() => Promise.resolve([])),
    getDestinations: mock(() => Promise.resolve([])),
    getDepartureSchedules: mock(() => Promise.resolve([])),
    getSeatAvailability: mock(() =>
      Promise.resolve({ totalSeats: 0, availableSeats: 0, available: [] }),
    ),
    getPurchasedTickets: mock(() => Promise.resolve([])),
    getTicketPdf: mock(() => Promise.resolve(Buffer.from(""))),
    ...overrides,
  };
}

async function buildTools(repo: EmtrafesaRepository): Promise<Tools> {
  const server = new McpServer({ name: "test", version: "0.0.0" });
  await registerTools(server, repo);
  return (server as unknown as { _registeredTools: Tools })._registeredTools;
}

/** Creates a fresh repo+tools pair, optionally overriding specific methods. */
export async function withRepo(
  overrides: Partial<EmtrafesaRepository> = {},
): Promise<{
  repo: EmtrafesaRepository;
  tools: Tools;
}> {
  const repo = createMockRepository(overrides);
  const tools = await buildTools(repo);
  return { repo, tools };
}
