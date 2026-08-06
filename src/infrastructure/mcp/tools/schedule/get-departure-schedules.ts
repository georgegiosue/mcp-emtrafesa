import { z } from "zod";
import { schedulesSchema } from "../../../../domain/models/emtrafesa.model";
import { TerminalDirectory } from "../../../../domain/services/terminal-directory";
import { READ_ONLY } from "../annotations";
import { errorResponse } from "../error";
import type { ToolRegistrar } from "../registrar";

const DESCRIPTION =
  "Find bus departures between two Peruvian cities. Pass city names as the traveller says them, e.g. from 'Chiclayo' to 'Trujillo'; matching ignores case and accents, and this tool resolves the route itself. Each departure carries departsAt and arrivesAt as ISO 8601 UTC timestamps, departureTime and arrivalTime as local Peru clock times, the service name, seats still available, deck count, the price per deck, and whether it is direct. Omitting date means today in Peru.";

const inputSchema = z.object({
  from: z.string().describe("Origin city name, e.g. 'Chiclayo'."),
  to: z.string().describe("Destination city name, e.g. 'Trujillo'."),
  date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "date must be DD/MM/YYYY")
    .optional()
    .describe(
      "Travel date as DD/MM/YYYY, e.g. '25/12/2026'. Defaults to today in Peru (America/Lima). Cannot be in the past.",
    ),
});

const outputSchema = z.object({
  schedules: schedulesSchema,
});

export const register: ToolRegistrar = (server, repository) => {
  server.registerTool(
    "get-departure-schedules",
    {
      title: "Get Departure Schedules",
      description: DESCRIPTION,
      inputSchema,
      outputSchema,
      annotations: { ...READ_ONLY, idempotentHint: false },
    },
    async ({ from, to, date }) => {
      try {
        const origin = TerminalDirectory.origins(
          await repository.getTerminals(),
        ).resolve(from);

        const destination = TerminalDirectory.destinationsFrom(
          origin,
          await repository.getDestinations({
            departureTerminalId: origin.id,
          }),
        ).resolve(to);

        const output = {
          schedules: await repository.getDepartureSchedules({
            departureTerminalId: origin.id,
            arrivalTerminalId: destination.id,
            date,
          }),
        };

        return {
          content: [{ type: "text", text: JSON.stringify(output) }],
          structuredContent: output,
        };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
};
