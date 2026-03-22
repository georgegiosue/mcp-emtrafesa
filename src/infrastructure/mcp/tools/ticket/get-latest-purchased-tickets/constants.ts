export const TOOL_NAME = "get-latest-purchased-tickets";

export const DESCRIPTION =
  "Look up the most recently purchased Emtrafesa bus tickets associated with a passenger's DNI and email address. Returns ticket records including travel date/time, seat numbers, ticket codes, price, operation number, and origin/destination. Use the values from the ticketsCodes array as input for get-ticket-pdf to download each PDF receipt.";

export const SCHEMA_DESCRIPTIONS = {
  DNI: "The passenger's DNI (Documento Nacional de Identidad), the Peruvian national ID number. Numeric string, typically 8 digits.",
  email:
    "The email address used when purchasing the tickets. Must match the DNI exactly as registered with Emtrafesa.",
} as const;
