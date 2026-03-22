import { z } from "zod";
import { SCHEMA_DESCRIPTIONS } from "./constants";

export const inputSchema = {
  ticketCode: z.string().describe(SCHEMA_DESCRIPTIONS.ticketCode),
};
