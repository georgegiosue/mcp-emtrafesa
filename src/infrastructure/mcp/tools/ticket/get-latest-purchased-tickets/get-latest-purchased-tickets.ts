import { errorResponse } from "../../error";
import type { Tool } from "../../tool";
import { inputSchema } from "./schema";
import type { Params } from "./types";

export const tool: Tool<
  Params,
  { description: string; inputSchema: typeof inputSchema }
> = {
  name: "get-latest-purchased-tickets",
  config: {
    description:
      "Look up the most recently purchased Emtrafesa bus tickets associated with a passenger's DNI and email address. Returns ticket records including travel date/time, seat numbers, ticket codes, price, operation number, and origin/destination. Use the values from the ticketsCodes array as input for get-ticket-pdf to download each PDF receipt.",
    inputSchema,
  },
  async handler({ DNI, email }, repository) {
    try {
      const tickets = await repository.getLatestPurchaseTickets({ DNI, email });
      return { content: [{ type: "text", text: JSON.stringify(tickets) }] };
    } catch (error) {
      return errorResponse(error);
    }
  },
};
