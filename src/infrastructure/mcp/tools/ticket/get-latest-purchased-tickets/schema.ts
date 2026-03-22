import { z } from "zod";

export const inputSchema = {
  DNI: z
    .string()
    .describe(
      "The passenger's DNI (Documento Nacional de Identidad), the Peruvian national ID number. Numeric string, typically 8 digits.",
    ),
  email: z
    .email()
    .describe(
      "The email address used when purchasing the tickets. Must match the DNI exactly as registered with Emtrafesa.",
    ),
};
