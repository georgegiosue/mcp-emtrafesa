import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getArrivalTerminalsByDepartureTerminal,
  getDepartureSchedules,
  getFrequentlyAskedQuestions,
  getLatestPurchaseTickets,
  getTerminals,
} from "@/internal/emtrafesa/services";
import type {
  DepartureSchedule,
  FAQ,
  Terminal,
} from "@/internal/emtrafesa/types";

export async function registerTools(server: McpServer) {
  server.tool(
    "get-terminals",
    "Get terminals throughout the country",
    async () => {
      try {
        const terminals: Terminal[] = await getTerminals();

        return {
          content: [{ type: "text", text: JSON.stringify(terminals) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                error instanceof Error ? error.message : "unknow error",
              ),
            },
          ],
        };
      }
    },
  );

  server.tool(
    "get-frequently-asked-questions",
    "Provides frequently asked questions about terminals, tickets, types of people, etc.",
    async () => {
      try {
        const faq: FAQ[] = await getFrequentlyAskedQuestions();

        return {
          content: [{ type: "text", text: JSON.stringify(faq) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                error instanceof Error ? error.message : "unknow error",
              ),
            },
          ],
        };
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
        const arrivalTerminals: Terminal[] =
          await getArrivalTerminalsByDepartureTerminal({ departureTerminalId });
        return {
          content: [{ type: "text", text: JSON.stringify(arrivalTerminals) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                error instanceof Error ? error.message : "unknown error",
              ),
            },
          ],
        };
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
      date: z
        .string()
        .optional()
        //Peru date format: DD/MM/YYYY - e.g. 14/07/2025
        .describe("Date in the format DD/MM/YYYY"),
    },
    async ({ departureTerminalId, arrivalTerminalId, date }) => {
      try {
        const schedules: DepartureSchedule[] = await getDepartureSchedules({
          departureTerminalId,
          arrivalTerminalId,
          date,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(schedules) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                error instanceof Error ? error.message : "unknown error",
              ),
            },
          ],
        };
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
        return {
          content: [{ type: "text", text: JSON.stringify(tickets) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                error instanceof Error ? error.message : "unknown error",
              ),
            },
          ],
        };
      }
    },
  );
}
