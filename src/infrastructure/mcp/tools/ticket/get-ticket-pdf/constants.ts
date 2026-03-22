export const TOOL_NAME = "get-ticket-pdf";

export const DESCRIPTION =
  "Download an Emtrafesa bus ticket as a PDF document. Returns the PDF as a base64-encoded resource. Requires a ticketCode obtained from the ticketsCodes array in get-latest-purchased-tickets results. A single purchase may have multiple ticket codes, one per seat — call this tool once per code to retrieve each document.";

export const SCHEMA_DESCRIPTIONS = {
  ticketCode:
    "The individual ticket code (boleto code) for a single seat. Obtain from the ticketsCodes array returned by get-latest-purchased-tickets.",
} as const;
