import { z } from "zod";
import { seatAvailabilitySchema } from "../../../../domain/models/emtrafesa.model";
import { TerminalDirectory } from "../../../../domain/services/terminal-directory";
import { READ_ONLY } from "../annotations";
import { errorResponse } from "../error";
import type { ToolRegistrar } from "../registrar";

const DESCRIPTION =
  "See which individual seats are still free on one departure, and on which deck. Call get-departure-schedules first and pass the scheduleId of the departure you care about, plus the same two city names. Use this when the traveller asks about seats, wants a window or lower-deck seat, or is choosing between departures on availability.";

const inputSchema = z.object({
  from: z.string().describe("Origin city name, e.g. 'Chiclayo'."),
  to: z.string().describe("Destination city name, e.g. 'Lima'."),
  scheduleId: z
    .number()
    .describe("The id of the departure, taken from get-departure-schedules."),
});

const outputSchema = z.object({
  seatAvailability: seatAvailabilitySchema,
});

export const register: ToolRegistrar = (server, repository) => {
  server.registerTool(
    "get-available-seats",
    {
      title: "Get Available Seats",
      description: DESCRIPTION,
      inputSchema,
      outputSchema,
      annotations: { ...READ_ONLY, idempotentHint: false },
    },
    async ({ from, to, scheduleId }) => {
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
          seatAvailability: await repository.getSeatAvailability({
            scheduleId,
            departureTerminalId: origin.id,
            arrivalTerminalId: destination.id,
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
