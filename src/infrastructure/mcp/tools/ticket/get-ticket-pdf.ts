import { z } from "zod";
import { READ_ONLY } from "../annotations";
import { errorResponse } from "../error";
import type { ToolRegistrar } from "../registrar";

const DESCRIPTION =
  "Download an Emtrafesa bus ticket as a PDF document. Returns the PDF as a base64-encoded resource. Requires a ticketCode obtained from the ticketsCodes array in get-latest-purchased-tickets results. A single purchase may have multiple ticket codes, one per seat — call this tool once per code to retrieve each document.";

const inputSchema = z.object({
  ticketCode: z
    .string()
    .min(1)
    .describe(
      "The individual ticket code (boleto code) for a single seat. Obtain from the ticketsCodes array returned by get-latest-purchased-tickets.",
    ),
});

export const register: ToolRegistrar = (server, repository) => {
  server.registerTool(
    "get-ticket-pdf",
    {
      title: "Get Ticket PDF",
      description: DESCRIPTION,
      inputSchema,
      annotations: READ_ONLY,
    },
    async ({ ticketCode }) => {
      try {
        const pdf = await repository.getTicketPdf({ ticketCode });

        return {
          content: [
            {
              type: "resource",
              resource: {
                uri: `ticket://${encodeURIComponent(ticketCode)}/document.pdf`,
                name: `Ticket ${ticketCode}`,
                mimeType: "application/pdf",
                blob: pdf.toString("base64"),
              },
            },
          ],
        };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
};
