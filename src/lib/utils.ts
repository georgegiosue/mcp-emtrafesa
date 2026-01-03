import { pdfToPng } from "pdf-to-png-converter";

export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}

export function isPdfBuffer(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  return buffer.subarray(0, 4).toString("ascii") === "%PDF";
}

export async function pdfBufferToPng(
  pdfBuffer: Buffer,
): Promise<{ pageNumber: number; content: Buffer }[]> {
  const pngPages = await pdfToPng(pdfBuffer.buffer as ArrayBuffer, {
    disableFontFace: false,
    useSystemFonts: true,
    verbosityLevel: 0,
    viewportScale: 2.0,
  });

  return pngPages
    .filter((page) => page.content !== undefined)
    .map((page) => ({
      pageNumber: page.pageNumber,
      content: page.content as Buffer,
    }));
}
