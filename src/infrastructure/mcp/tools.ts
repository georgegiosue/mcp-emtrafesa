import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { EmtrafesaRepository } from "../../domain/ports/emtrafesa.repository";
import { bufferToBase64 } from "../../shared/utils";

function errorResponse(error: unknown) {
  return {
    isError: true as const,
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
  server.registerTool(
    "get-terminals",
    {
      description:
        "Retrieve all Emtrafesa bus terminals across Peru. Returns a list of terminal objects each with an Id, Nombre (name), and Direccion (address). Call this tool first to discover valid terminal IDs before querying destinations or schedules. The Id field is required as input for get-arrival-terminals and get-departure-schedules.",
    },
    async () => {
      try {
        const terminals = await repository.getTerminals();
        return { content: [{ type: "text", text: JSON.stringify(terminals) }] };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );

  server.registerTool(
    "get-frequently-asked-questions",
    {
      description:
        "Retrieve the official Emtrafesa FAQ list covering topics such as terminal locations, ticket purchasing, passenger categories (children, seniors, etc.), luggage policies, and service rules. Use this to answer general questions about how Emtrafesa operates without needing to query schedules or tickets.",
    },
    async () => {
      try {
        const faq = await repository.getFrequentlyAskedQuestions();
        return { content: [{ type: "text", text: JSON.stringify(faq) }] };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );

  server.registerTool(
    "get-arrival-terminals",
    {
      description:
        "Retrieve all available destination terminals reachable from a given departure terminal. Call get-terminals first to obtain a valid departureTerminalId. Use the Id values from the returned list as the arrivalTerminalId when calling get-departure-schedules.",
      inputSchema: {
        departureTerminalId: z
          .string()
          .describe(
            "The unique identifier of the origin (departure) terminal. Obtain this from the Id field returned by get-terminals.",
          ),
      },
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

  server.registerTool(
    "get-departure-schedules",
    {
      description:
        "Retrieve available bus departure schedules between two Emtrafesa terminals. Returns schedule objects including departure time, arrival time, service class, available seats per floor, ticket prices, and whether the service is direct. If no date is provided, defaults to today in Peru time (America/Lima timezone). Call get-terminals and get-arrival-terminals first to obtain valid terminal IDs.",
      inputSchema: {
        departureTerminalId: z
          .string()
          .describe(
            "The unique identifier of the origin terminal. Obtain from the Id field returned by get-terminals.",
          ),
        arrivalTerminalId: z
          .string()
          .describe(
            "The unique identifier of the destination terminal. Obtain from the Id field returned by get-arrival-terminals for the selected departure terminal.",
          ),
        date: z
          .string()
          .optional()
          .describe(
            "Travel date in DD/MM/YYYY format (e.g. '25/12/2025'). If omitted, defaults to today in Peru time (America/Lima). Cannot be a past date.",
          ),
      },
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

  server.registerTool(
    "get-latest-purchased-tickets",
    {
      description:
        "Look up the most recently purchased Emtrafesa bus tickets associated with a passenger's DNI and email address. Returns ticket records including travel date/time, seat numbers, ticket codes, price, operation number, and origin/destination. Use the values from the ticketsCodes array as input for get-ticket-pdf to download each PDF receipt.",
      inputSchema: {
        DNI: z
          .string()
          .describe(
            "The passenger's DNI (Documento Nacional de Identidad), the Peruvian national ID number. Numeric string, typically 8 digits.",
          ),
        email: z
          .email()
          .describe(
            "The email address used when purchasing the tickets. Must match the DNI exactly as registered with Emtrafesa.",
          ),
      },
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

  server.registerTool(
    "get-ticket-pdf",
    {
      description:
        "Download an Emtrafesa bus ticket as a PDF document. Returns the PDF as a base64-encoded resource. Requires a ticketCode obtained from the ticketsCodes array in get-latest-purchased-tickets results. A single purchase may have multiple ticket codes, one per seat — call this tool once per code to retrieve each document.",
      inputSchema: {
        ticketCode: z
          .string()
          .describe(
            "The individual ticket code (boleto code) for a single seat. Obtain from the ticketsCodes array returned by get-latest-purchased-tickets.",
          ),
      },
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
