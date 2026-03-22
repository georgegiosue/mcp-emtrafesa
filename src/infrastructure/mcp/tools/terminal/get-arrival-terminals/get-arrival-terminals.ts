import { errorResponse } from "../../error";
import type { Tool } from "../../tool";
import { inputSchema } from "./schema";
import type { Params } from "./types";

export const tool: Tool<
  Params,
  { description: string; inputSchema: typeof inputSchema }
> = {
  name: "get-arrival-terminals",
  config: {
    description:
      "Retrieve all available destination terminals reachable from a given departure terminal. Call get-terminals first to obtain a valid departureTerminalId. Use the Id values from the returned list as the arrivalTerminalId when calling get-departure-schedules.",
    inputSchema,
  },
  async handler({ departureTerminalId }, repository) {
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
};
