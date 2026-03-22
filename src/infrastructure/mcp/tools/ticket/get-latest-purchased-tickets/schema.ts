import { z } from "zod";
import { SCHEMA_DESCRIPTIONS } from "./constants";

export const inputSchema = {
  DNI: z.string().describe(SCHEMA_DESCRIPTIONS.DNI),
  email: z.email().describe(SCHEMA_DESCRIPTIONS.email),
};
