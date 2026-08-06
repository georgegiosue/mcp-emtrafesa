import { readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  Schedule,
  Terminal,
  Ticket,
} from "../../src/domain/models/emtrafesa.model";

const FIXTURES_DIR = join(import.meta.dir, "../fixtures");

export function loadText(filename: string): string {
  return readFileSync(join(FIXTURES_DIR, filename), "utf-8");
}

export const expected = {
  terminalCount: 27,
  arrivalTerminalCount: 21,
  faqCount: 4,

  firstTerminal: {
    id: "001",
    name: "TRUJILLO",
    address:
      "AV. TUPAC AMARU 185 URB. HUERTA GRANDE - LA LIBERTAD-TRUJILLO-TRUJILLO",
  } satisfies Terminal,

  firstArrivalTerminal: {
    id: "5",
    name: "CAJAMARCA",
    address: "AV. ATAHUALPA 606 - CAJAMARCA-CAJAMARCA-CAJAMARCA",
  } satisfies Terminal,

  firstFaqQuestion: "Cómo sacar pasajes para menores de Edad",

  schedules: [
    {
      id: 2026021992,
      departsAt: "2026-03-23T00:00:00.000Z",
      arrivesAt: "2026-03-23T09:20:00.000Z",
      departureTime: "07:00 PM",
      arrivalTime: "04:20 AM",
      isDirect: false,
      service: "Fenix",
      availableSeats: 1,
      decks: 2,
      priceFirstDeck: 100,
      priceSecondDeck: 75,
      carryOnLuggageOnly: false,
      departureTimeIsApproximate: false,
      seatsWithSurcharge: [],
    },
  ] satisfies Schedule[],

  tickets: [
    {
      dateTime: "Domingo 22 Mar 2026 07:00 PM",
      seats: ["12", "13"],
      ticketsCodes: ["BP01-0001", "BP01-0002"],
      price: "S/. 100.00",
      operationNumber: "987654",
      origin: "TRUJILLO",
      destination: "LIMA",
    },
  ] satisfies Ticket[],
};
