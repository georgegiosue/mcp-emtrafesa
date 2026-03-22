import { describe, expect, it, mock } from "bun:test";
import { fixtures } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

const ticketCode = fixtures.tickets[0].ticketsCodes[0];

describe("get-ticket-pdf", () => {
  it("returns a resource with correct uri, mimeType, and base64 blob", async () => {
    const pdfBuffer = Buffer.from("%PDF-1.4 fake content");
    const { repo, tools } = await withRepo({
      downloadTicketPDF: mock(() => Promise.resolve(pdfBuffer)),
    });

    const result = (await tools["get-ticket-pdf"].handler(
      { ticketCode },
      {},
    )) as {
      content: {
        type: string;
        resource: { uri: string; name: string; mimeType: string; blob: string };
      }[];
    };

    expect(result.content[0].type).toBe("resource");
    expect(result.content[0].resource.uri).toBe(
      `ticket://${ticketCode}/document.pdf`,
    );
    expect(result.content[0].resource.name).toBe(`Ticket ${ticketCode}`);
    expect(result.content[0].resource.mimeType).toBe("application/pdf");
    expect(result.content[0].resource.blob).toBe(pdfBuffer.toString("base64"));
    expect(repo.downloadTicketPDF).toHaveBeenCalledWith({ ticketCode });
  });

  it("returns empty blob string for an empty buffer", async () => {
    const { tools } = await withRepo({
      downloadTicketPDF: mock(() => Promise.resolve(Buffer.from(""))),
    });

    const result = (await tools["get-ticket-pdf"].handler(
      { ticketCode },
      {},
    )) as {
      content: { type: string; resource: { blob: string } }[];
    };

    expect(result.content[0].resource.blob).toBe("");
  });

  it("returns error text response when repository throws", async () => {
    const { tools } = await withRepo({
      downloadTicketPDF: mock(() =>
        Promise.reject(new Error("Failed to download ticket PDF: Not Found")),
      ),
    });

    const result = (await tools["get-ticket-pdf"].handler(
      { ticketCode },
      {},
    )) as {
      content: { type: string; text: string }[];
    };

    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toBe(
      "Failed to download ticket PDF: Not Found",
    );
  });
});
