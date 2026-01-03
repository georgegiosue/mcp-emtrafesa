/**
 * Utility functions for data conversion and manipulation
 */

/**
 * Converts a Buffer to a base64 string
 * @param buffer - The buffer to convert
 * @returns Base64 encoded string
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}

/**
 * Creates a data URL from a buffer with the specified MIME type
 * @param buffer - The buffer containing the file data
 * @param mimeType - The MIME type of the file (e.g., 'application/pdf', 'image/png')
 * @returns Data URL string
 */
export function bufferToDataUrl(buffer: Buffer, mimeType: string): string {
  const base64 = bufferToBase64(buffer);
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Validates if a buffer contains PDF data by checking PDF header
 * @param buffer - The buffer to validate
 * @returns True if the buffer appears to be a PDF
 */
export function isPdfBuffer(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;

  // PDF files start with "%PDF"
  const pdfHeader = buffer.subarray(0, 4).toString("ascii");
  return pdfHeader === "%PDF";
}

/**
 * Gets the appropriate MIME type for PDF content
 * @returns PDF MIME type
 */
export function getPdfMimeType(): string {
  return "application/pdf";
}

/**
 * Creates a downloadable PDF data URL from a buffer
 * @param buffer - The PDF buffer
 * @returns Data URL for the PDF
 */
export function createPdfDataUrl(buffer: Buffer): string {
  if (!isPdfBuffer(buffer)) {
    throw new Error("Buffer does not contain valid PDF data");
  }

  return bufferToDataUrl(buffer, getPdfMimeType());
}
