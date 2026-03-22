import { z } from "zod";

export const inputSchema = {
  ticketCode: z
    .string()
    .describe(
      "The individual ticket code (boleto code) for a single seat. Obtain from the ticketsCodes array returned by get-latest-purchased-tickets.",
    ),
};
