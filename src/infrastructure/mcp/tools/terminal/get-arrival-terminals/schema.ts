import { z } from "zod";

export const inputSchema = {
  departureTerminalId: z
    .string()
    .describe(
      "The unique identifier of the origin (departure) terminal. Obtain this from the Id field returned by get-terminals.",
    ),
};
