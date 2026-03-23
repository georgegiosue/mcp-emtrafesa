import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EmtrafesaRepository } from "../../../domain/ports/emtrafesa.repository";
import { tool as getFrequentlyAskedQuestions } from "./faq/get-frequently-asked-questions/get-frequently-asked-questions";
import { tool as getDepartureSchedules } from "./schedule/get-departure-schedules/get-departure-schedules";
import { tool as getArrivalTerminals } from "./terminal/get-arrival-terminals/get-arrival-terminals";
import { tool as getTerminals } from "./terminal/get-terminals/get-terminals";
import { tool as getLatestPurchasedTickets } from "./ticket/get-latest-purchased-tickets/get-latest-purchased-tickets";
import { tool as getTicketPdf } from "./ticket/get-ticket-pdf/get-ticket-pdf";
import { register, type Tool } from "./tool";

const tools = [
  getTerminals,
  getArrivalTerminals,
  getDepartureSchedules,
  getFrequentlyAskedQuestions,
  getLatestPurchasedTickets,
  getTicketPdf,
];

export async function registerTools(
  server: McpServer,
  repository: EmtrafesaRepository,
) {
  for (const tool of tools as Tool<unknown>[]) {
    register(server, repository, tool);
  }
}
