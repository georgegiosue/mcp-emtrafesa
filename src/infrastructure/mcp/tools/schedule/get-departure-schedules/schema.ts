import { z } from "zod";
import { SCHEMA_DESCRIPTIONS } from "./constants";

export const inputSchema = {
  departureTerminalId: z
    .string()
    .describe(SCHEMA_DESCRIPTIONS.departureTerminalId),
  arrivalTerminalId: z.string().describe(SCHEMA_DESCRIPTIONS.arrivalTerminalId),
  date: z.string().optional().describe(SCHEMA_DESCRIPTIONS.date),
};
