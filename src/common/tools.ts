import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  downloadTicketPDF,
  getArrivalTerminalsByDepartureTerminal,
  getDepartureSchedules,
  getFrequentlyAskedQuestions,
  getLatestPurchaseTickets,
  getTerminals,
} from "@/internal/emtrafesa/services";
import { bufferToBase64, isPdfBuffer, pdfBufferToPng } from "@/lib/utils";

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

export async function registerTools(server: McpServer) {
  server.tool(
    "get-terminals",
    "Get terminals throughout the country",
    async () => {
      try {
        const terminals = await getTerminals();
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
        const faq = await getFrequentlyAskedQuestions();
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
        const arrivalTerminals = await getArrivalTerminalsByDepartureTerminal({
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
        const schedules = await getDepartureSchedules({
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
        const tickets = await getLatestPurchaseTickets({ DNI, email });
        return { content: [{ type: "text", text: JSON.stringify(tickets) }] };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );

  server.tool(
    "get-ticket-image",
    "Get a ticket as PNG image by its code.",
    {
      ticketCode: z.string().describe("Ticket code"),
    },
    async ({ ticketCode }) => {
      try {
        const pdfBuffer = await downloadTicketPDF({ tiketCode: ticketCode });

        if (!isPdfBuffer(pdfBuffer)) {
          throw new Error("Received invalid PDF data from server");
        }

        const pngPages = await pdfBufferToPng(pdfBuffer);

        if (pngPages.length === 0) {
          throw new Error("Failed to convert PDF to images");
        }

        return {
          content: pngPages.map((page) => ({
            type: "image" as const,
            data: bufferToBase64(page.content),
            mimeType: "image/png" as const,
          })),
        };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
}
