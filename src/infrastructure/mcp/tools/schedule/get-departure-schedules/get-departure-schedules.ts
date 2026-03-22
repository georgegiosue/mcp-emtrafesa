import { errorResponse } from "../../error";
import type { Tool } from "../../tool";
import { DESCRIPTION, TOOL_NAME } from "./constants";
import { inputSchema } from "./schema";
import type { Params } from "./types";

export const tool: Tool<
  Params,
  { description: string; inputSchema: typeof inputSchema }
> = {
  name: TOOL_NAME,
  config: { description: DESCRIPTION, inputSchema },
  async handler({ departureTerminalId, arrivalTerminalId, date }, repository) {
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
};
