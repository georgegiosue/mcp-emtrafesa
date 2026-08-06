import { z } from "zod";

const PDF_MAGIC = "%PDF";

const upstreamErrorSchema = z.object({ message: z.string() });

function describeNonPdf(body: Buffer): string {
  try {
    return upstreamErrorSchema.parse(JSON.parse(body.toString("utf-8")))
      .message;
  } catch {
    return "the ticket code is probably invalid or expired";
  }
}

export function readTicketPdf(bytes: ArrayBuffer, ticketCode: string): Buffer {
  const pdf = Buffer.from(bytes);

  if (pdf.subarray(0, PDF_MAGIC.length).toString() !== PDF_MAGIC) {
    throw new Error(
      `Emtrafesa did not return a PDF for ticket ${ticketCode}: ${describeNonPdf(pdf)}`,
    );
  }

  return pdf;
}
