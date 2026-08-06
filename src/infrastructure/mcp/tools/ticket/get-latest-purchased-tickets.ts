import { z } from "zod";
import { ticketsSchema } from "../../../../domain/models/emtrafesa.model";
import { READ_ONLY } from "../annotations";
import { errorResponse } from "../error";
import type { ToolRegistrar } from "../registrar";

const DESCRIPTION =
  "Look up the most recently purchased Emtrafesa bus tickets associated with a passenger's DNI and email address. Returns ticket records including travel date/time, seat numbers, ticket codes, price, operation number, and origin/destination. Use the values from the ticketsCodes array as input for get-ticket-pdf to download each PDF receipt.";

const inputSchema = z.object({
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
});

const outputSchema = z.object({
  tickets: ticketsSchema,
});

export const register: ToolRegistrar = (server, repository) => {
  server.registerTool(
    "get-latest-purchased-tickets",
    {
      title: "Get Latest Purchased Tickets",
      description: DESCRIPTION,
      inputSchema,
      outputSchema,
      annotations: READ_ONLY,
    },
    async ({ DNI, email }) => {
      try {
        const output = {
          tickets: await repository.getPurchasedTickets({ DNI, email }),
        };

        return {
          content: [{ type: "text", text: JSON.stringify(output) }],
          structuredContent: output,
        };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
};
