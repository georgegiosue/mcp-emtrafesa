import { bufferToBase64 } from "../../../../../shared/utils";
import { errorResponse } from "../../error";
import type { Tool } from "../../tool";
import { DESCRIPTION, TOOL_NAME } from "./constants";
import { inputSchema } from "./schema";
import type { Params } from "./types";

export const tool: Tool<Params> = {
  name: TOOL_NAME,
  config: { description: DESCRIPTION, inputSchema },
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
