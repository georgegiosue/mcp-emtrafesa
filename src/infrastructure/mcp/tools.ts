import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { EmtrafesaRepository } from "../../domain/ports/emtrafesa.repository";
import { bufferToBase64 } from "../../shared/utils";

function errorResponse(error: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: error instanceof Error ? error.message : "unknown error",
      },
    ],
  };
}

export function registerTools(
  server: McpServer,
  repository: EmtrafesaRepository,
) {
  server.tool(
    "get-terminals",
    "Get terminals throughout the country",
    async () => {
      try {
        const terminals = await repository.getTerminals();
        return { content: [{ type: "text", text: JSON.stringify(terminals) }] };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );

  server.tool(
    "get-frequently-asked-questions",
    "Provides frequently asked questions about terminals, tickets, types of people, etc.",
    async () => {
      try {
        const faq = await repository.getFrequentlyAskedQuestions();
        return { content: [{ type: "text", text: JSON.stringify(faq) }] };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );

  server.tool(
    "get-arrival-terminal",
    "Get arrival terminal for a departure terminal.",
    {
      departureTerminalId: z
        .string()
        .describe("Departure terminal id (origin)"),
    },
    async ({ departureTerminalId }) => {
      try {
        const arrivalTerminals =
          await repository.getArrivalTerminalsByDepartureTerminal({
            departureTerminalId,
          });
        return {
          content: [{ type: "text", text: JSON.stringify(arrivalTerminals) }],
        };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );

  server.tool(
    "get-departure-schedules",
    "Get departure schedules for a specific departure terminal.",
    {
      departureTerminalId: z
        .string()
        .describe("Departure terminal id (origin)"),
      arrivalTerminalId: z
        .string()
        .describe("Arrival terminal id (destination)"),
      date: z.string().optional().describe("Date in the format DD/MM/YYYY"),
    },
    async ({ departureTerminalId, arrivalTerminalId, date }) => {
      try {
        const schedules = await repository.getDepartureSchedules({
          departureTerminalId,
          arrivalTerminalId,
          date,
        });
        return { content: [{ type: "text", text: JSON.stringify(schedules) }] };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );

  server.tool(
    "get-latest-purchased-tickets",
    "Get the latest purchased tickets for a specific departure terminal.",
    {
      DNI: z.string().describe("DNI of the user"),
      email: z.string().email().describe("Email of the user"),
    },
    async ({ DNI, email }) => {
      try {
        const tickets = await repository.getLatestPurchaseTickets({
          DNI,
          email,
        });
        return { content: [{ type: "text", text: JSON.stringify(tickets) }] };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );

  server.tool(
    "get-ticket-pdf",
    "Download and view a ticket PDF by its code. Returns a data URL that can be opened in browser.",
    {
      ticketCode: z.string().describe("Ticket code"),
    },
    async ({ ticketCode }) => {
      try {
        const pdfBuffer = await repository.downloadTicketPDF({ ticketCode });
        const base64Data = bufferToBase64(pdfBuffer);

        return {
          content: [
            {
              type: "resource",
              resource: {
                uri: `ticket://${ticketCode}/document.pdf`,
                name: `Ticket ${ticketCode}`,
                mimeType: "application/pdf",
                blob: base64Data,
              },
            },
          ],
        };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
}
