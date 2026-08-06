import { z } from "zod";

export const terminalSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
});

export const terminalsSchema = z.array(terminalSchema);

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const faqsSchema = z.array(faqSchema);

const ticketSchema = z.object({
  dateTime: z.string(),
  seats: z.array(z.string()),
  ticketsCodes: z.array(z.string()),
  price: z.string(),
  operationNumber: z.string(),
  origin: z.string().optional(),
  destination: z.string().optional(),
});

export const ticketsSchema = z.array(ticketSchema);

const seatSurchargeSchema = z.object({
  seatNumber: z.number(),
  deck: z.number(),
});

const scheduleSchema = z.object({
  id: z.number().describe("Emtrafesa's identifier for this departure."),
  departsAt: z.iso.datetime().describe("Departure instant, ISO 8601 UTC."),
  arrivesAt: z.iso.datetime().describe("Arrival instant, ISO 8601 UTC."),
  departureTime: z
    .string()
    .describe("Departure time on the clock in Peru, e.g. '05:30 PM'."),
  arrivalTime: z
    .string()
    .describe("Arrival time on the clock in Peru, e.g. '09:00 PM'."),
  isDirect: z
    .boolean()
    .describe("True when the bus runs non-stop; false when it makes stops."),
  service: z
    .string()
    .describe(
      "Emtrafesa's commercial name for the service, e.g. 'Normal', '180 Cama', 'Super Fenix'. These are brand names, not a graded scale — rank options by priceFirstDeck and isDirect rather than by the name.",
    ),
  availableSeats: z
    .number()
    .describe(
      "Seats still on sale. 0 means the departure is sold out — it still runs, but nothing is bookable.",
    ),
  decks: z.number().describe("How many passenger decks the bus has, 1 or 2."),
  priceFirstDeck: z.number().describe("Lower-deck fare in Peruvian soles."),
  priceSecondDeck: z
    .number()
    .optional()
    .describe(
      "Upper-deck fare in soles. Absent on single-deck buses, where there is no upper deck to price.",
    ),
  carryOnLuggageOnly: z
    .boolean()
    .optional()
    .describe("True when only hand luggage is allowed on this departure."),
  departureTimeIsApproximate: z
    .boolean()
    .optional()
    .describe("True when Emtrafesa flags the departure time as approximate."),
  seatsWithSurcharge: z
    .array(seatSurchargeSchema)
    .optional()
    .describe(
      "Seats on this bus that cost more than the deck fare. Emtrafesa does not publish the extra amount.",
    ),
});

export const schedulesSchema = z.array(scheduleSchema);

const seatSchema = z.object({
  number: z.number().describe("Seat number as printed on the bus."),
  deck: z
    .number()
    .describe("Deck the seat is on: 1 is the lower deck, 2 the upper one."),
});

export const seatAvailabilitySchema = z.object({
  totalSeats: z.number().describe("Seats on this bus, taken or not."),
  availableSeats: z
    .number()
    .describe("How many of them are still bookable right now."),
  available: z
    .array(seatSchema)
    .describe(
      "The seats that are free. Empty when the departure is sold out. Availability changes as other people buy, so treat it as a snapshot.",
    ),
});

export type Terminal = z.infer<typeof terminalSchema>;
export type FAQ = z.infer<typeof faqSchema>;
export type Ticket = z.infer<typeof ticketSchema>;
export type Schedule = z.infer<typeof scheduleSchema>;
export type SeatAvailability = z.infer<typeof seatAvailabilitySchema>;

export type DestinationsParams = {
  departureTerminalId: string;
};

export type ScheduleParams = {
  departureTerminalId: string;
  arrivalTerminalId: string;
  date?: string;
};

export type SeatAvailabilityParams = {
  scheduleId: number;
  departureTerminalId: string;
  arrivalTerminalId: string;
};

export type TicketLookupParams = {
  DNI: string;
  email: string;
};

export type TicketDownloadParams = {
  ticketCode: string;
};
