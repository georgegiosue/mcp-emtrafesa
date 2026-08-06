import { z } from "zod";
import { terminalSchema } from "../../../../domain/models/emtrafesa.model";
import { READ_ONLY } from "../annotations";
import { errorResponse } from "../error";
import type { ToolRegistrar } from "../registrar";

const DESCRIPTION =
  "Retrieve all Emtrafesa bus terminals across Peru. Returns a list of terminals, each with an id, name, and address. Call this tool first to discover valid terminal ids before querying destinations or schedules. The id field is required as input for get-arrival-terminals and get-departure-schedules.";

const outputSchema = z.object({
  terminals: z.array(terminalSchema.omit({ id: true })),
});

export const register: ToolRegistrar = (server, repository) => {
  server.registerTool(
    "get-terminals",
    {
      title: "Get Terminals",
      description: DESCRIPTION,
      outputSchema,
      annotations: READ_ONLY,
    },
    async () => {
      try {
        const output = {
          terminals: (await repository.getTerminals()).map(
            ({ name, address }) => ({ name, address }),
          ),
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
