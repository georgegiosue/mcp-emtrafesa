import { errorResponse } from "../error";
import type { Tool } from "../tool";
import { inputSchema } from "./schema";
import type { Params } from "./types";

export const tool: Tool<
  Params,
  { description: string; inputSchema: typeof inputSchema }
> = {
  name: "get-departure-schedules",
  config: {
    description:
      "Retrieve available bus departure schedules between two Emtrafesa terminals. Returns schedule objects including departure time, arrival time, service class, available seats per floor, ticket prices, and whether the service is direct. If no date is provided, defaults to today in Peru time (America/Lima timezone). Call get-terminals and get-arrival-terminals first to obtain valid terminal IDs.",
    inputSchema,
  },
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
