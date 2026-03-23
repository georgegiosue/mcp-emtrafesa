import { errorResponse } from "../../error";
import type { Tool } from "../../tool";
import { DESCRIPTION, TOOL_NAME } from "./constants";
import { inputSchema } from "./schema";
import type { Params } from "./types";

export const tool: Tool<Params> = {
  name: TOOL_NAME,
  config: { description: DESCRIPTION, inputSchema },
  async handler({ DNI, email }, repository) {
    try {
      const tickets = await repository.getLatestPurchaseTickets({ DNI, email });
      return { content: [{ type: "text", text: JSON.stringify(tickets) }] };
    } catch (error) {
      return errorResponse(error);
    }
  },
};
