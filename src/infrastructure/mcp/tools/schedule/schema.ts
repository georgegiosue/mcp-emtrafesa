import { z } from "zod";

export const inputSchema = {
  departureTerminalId: z
    .string()
    .describe(
      "The unique identifier of the origin terminal. Obtain from the Id field returned by get-terminals.",
    ),
  arrivalTerminalId: z
    .string()
    .describe(
      "The unique identifier of the destination terminal. Obtain from the Id field returned by get-arrival-terminals for the selected departure terminal.",
    ),
  date: z
    .string()
    .optional()
    .describe(
      "Travel date in DD/MM/YYYY format (e.g. '25/12/2025'). If omitted, defaults to today in Peru time (America/Lima). Cannot be a past date.",
    ),
};
