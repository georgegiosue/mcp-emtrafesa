import type { McpServer } from "@modelcontextprotocol/server";
import type { EmtrafesaRepository } from "../../../domain/ports/emtrafesa.repository";
import { register as getFrequentlyAskedQuestions } from "./faq/get-frequently-asked-questions";
import { register as getAvailableSeats } from "./schedule/get-available-seats";
import { register as getDepartureSchedules } from "./schedule/get-departure-schedules";
import { register as getArrivalTerminals } from "./terminal/get-arrival-terminals";
import { register as getTerminals } from "./terminal/get-terminals";
import { register as getLatestPurchasedTickets } from "./ticket/get-latest-purchased-tickets";
import { register as getTicketPdf } from "./ticket/get-ticket-pdf";

const tools = [
  getTerminals,
  getArrivalTerminals,
  getDepartureSchedules,
  getAvailableSeats,
  getFrequentlyAskedQuestions,
  getLatestPurchasedTickets,
  getTicketPdf,
];

export function registerTools(
  server: McpServer,
  repository: EmtrafesaRepository,
): void {
  for (const register of tools) {
    register(server, repository);
  }
}
