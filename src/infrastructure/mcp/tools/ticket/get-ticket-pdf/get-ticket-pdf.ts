import { bufferToBase64 } from "../../../../../shared/utils";
import { errorResponse } from "../../error";
import type { Tool } from "../../tool";
import { inputSchema } from "./schema";
import type { Params } from "./types";

export const tool: Tool<
  Params,
  { description: string; inputSchema: typeof inputSchema }
> = {
  name: "get-ticket-pdf",
  config: {
    description:
      "Download an Emtrafesa bus ticket as a PDF document. Returns the PDF as a base64-encoded resource. Requires a ticketCode obtained from the ticketsCodes array in get-latest-purchased-tickets results. A single purchase may have multiple ticket codes, one per seat — call this tool once per code to retrieve each document.",
    inputSchema,
  },
  async handler({ ticketCode }, repository) {
    try {
      const pdfBuffer = await repository.downloadTicketPDF({ ticketCode });
      const base64Data = bufferToBase64(pdfBuffer);
      return {
        content: [
          {
            type: "resource",
            resource: {
              uri: `ticket://${ticketCode}/document.pdf`,
              name: `Ticket ${ticketCode}`,
              mimeType: "application/pdf",
              blob: base64Data,
            },
          },
        ],
      };
    } catch (error) {
      return errorResponse(error);
    }
  },
};
