import { z } from "zod";
import { terminalSchema } from "../../../../domain/models/emtrafesa.model";
import { TerminalDirectory } from "../../../../domain/services/terminal-directory";
import { READ_ONLY } from "../annotations";
import { errorResponse } from "../error";
import type { ToolRegistrar } from "../registrar";

const DESCRIPTION =
  "List the cities you can travel to from a given origin city. Pass city names as the traveller says them; matching ignores case and accents. Use this to answer 'where can I go from X', or to check a route exists before asking for schedules.";

const inputSchema = z.object({
  from: z
    .string()
    .describe(
      "Origin city name, e.g. 'Chiclayo'. Call get-terminals if you need the list of cities Emtrafesa serves.",
    ),
});

const outputSchema = z.object({
  arrivalTerminals: z.array(terminalSchema.omit({ id: true })),
});

export const register: ToolRegistrar = (server, repository) => {
  server.registerTool(
    "get-arrival-terminals",
    {
      title: "Get Arrival Terminals",
      description: DESCRIPTION,
      inputSchema,
      outputSchema,
      annotations: READ_ONLY,
    },
    async ({ from }) => {
      try {
        const origin = TerminalDirectory.origins(
          await repository.getTerminals(),
        ).resolve(from);

        const destinations = await repository.getDestinations({
          departureTerminalId: origin.id,
        });

        const output = {
          arrivalTerminals: destinations.map(({ name, address }) => ({
            name,
            address,
          })),
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
