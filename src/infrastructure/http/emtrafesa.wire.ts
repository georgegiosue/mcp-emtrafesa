import { z } from "zod";
import type {
  FAQ,
  Schedule,
  SeatAvailability,
  Terminal,
} from "../../domain/models/emtrafesa.model";

const terminalWireSchema = z.object({
  Id: z.string(),
  Nombre: z.string(),
  Direccion: z.string(),
});

const faqWireSchema = z.object({
  Pregunta: z.string(),
  Respuesta: z.string(),
});

const seatSurchargeWireSchema = z.object({
  IdPlanoBus: z.string(),
  NumeroAsiento: z.number(),
  Nivel: z.number(),
});

const scheduleWireSchema = z.object({
  Programacion_Id: z.number(),
  Bus_Croquis_Id: z.string(),
  Embarque_FechaHora: z.string(),
  Desembarque_FechaHora: z.string(),
  Embarque_FechaHora_Str: z.string(),
  Desembarque_FechaHora_Str: z.string(),
  EsDirecto: z.boolean(),
  EsDirecto_Str: z.string(),
  Servicio_Descripcion: z.string(),
  Bus_AsientosLibres: z.number(),
  Bus_Pisos: z.number(),
  Precio_Piso1: z.number(),
  Precio_Piso2: z.number(),
  Embarque_SoloEquipajeDeMano: z.boolean().optional(),
  Embarque_LaHoraEsReferencial: z.boolean().optional(),
  ArrIncremento: z.array(seatSurchargeWireSchema).optional(),
});

const SEAT_OBJECT = 1;

const busObjectWireSchema = z.object({
  Objeto_Tipo_Id: z.number(),
  Asiento_Numero: z.number(),
  PisoNumero: z.number(),
  Asiento_EstaOcupado: z.boolean(),
});

const busObjectsWireSchema = z.array(busObjectWireSchema);

const terminalsWireSchema = z.array(terminalWireSchema);
const faqsWireSchema = z.array(faqWireSchema);
const schedulesWireSchema = z.array(scheduleWireSchema);

const DOTNET_DATE = /^\/Date\((-?\d+)\)\/$/;

function parseDotNetDate(value: string, field: string): string {
  const match = DOTNET_DATE.exec(value);

  if (!match) {
    throw new Error(
      `Emtrafesa sent an unrecognised date in ${field}: ${value}`,
    );
  }

  return new Date(Number(match[1])).toISOString();
}

export function parseTerminals(payload: unknown): Terminal[] {
  return terminalsWireSchema.parse(payload).map((terminal) => ({
    id: terminal.Id.trim(),
    name: terminal.Nombre.trim(),
    address: terminal.Direccion.trim(),
  }));
}

export function parseFaqs(payload: unknown): FAQ[] {
  return faqsWireSchema.parse(payload).map((faq) => ({
    question: faq.Pregunta.trim(),
    answer: faq.Respuesta.trim(),
  }));
}

export function parseSchedules(payload: unknown): Schedule[] {
  return schedulesWireSchema.parse(payload).map((schedule) => ({
    id: schedule.Programacion_Id,
    departsAt: parseDotNetDate(
      schedule.Embarque_FechaHora,
      "Embarque_FechaHora",
    ),
    arrivesAt: parseDotNetDate(
      schedule.Desembarque_FechaHora,
      "Desembarque_FechaHora",
    ),
    departureTime: schedule.Embarque_FechaHora_Str,
    arrivalTime: schedule.Desembarque_FechaHora_Str,
    isDirect: schedule.EsDirecto,
    service: schedule.Servicio_Descripcion.replace(/^[A-Z]\s*-\s*/, "").trim(),
    availableSeats: schedule.Bus_AsientosLibres,
    decks: schedule.Bus_Pisos,
    priceFirstDeck: schedule.Precio_Piso1,
    priceSecondDeck: schedule.Bus_Pisos > 1 ? schedule.Precio_Piso2 : undefined,
    carryOnLuggageOnly: schedule.Embarque_SoloEquipajeDeMano,
    departureTimeIsApproximate: schedule.Embarque_LaHoraEsReferencial,
    seatsWithSurcharge: schedule.ArrIncremento?.filter(
      (seat) => seat.IdPlanoBus === schedule.Bus_Croquis_Id,
    ).map((seat) => ({
      seatNumber: seat.NumeroAsiento,
      deck: seat.Nivel,
    })),
  }));
}

export function parseSeatAvailability(payload: unknown): SeatAvailability {
  const seats = busObjectsWireSchema
    .parse(payload)
    .filter((object) => object.Objeto_Tipo_Id === SEAT_OBJECT);

  const available = seats
    .filter((seat) => !seat.Asiento_EstaOcupado)
    .map((seat) => ({ number: seat.Asiento_Numero, deck: seat.PisoNumero }));

  return {
    totalSeats: seats.length,
    availableSeats: available.length,
    available,
  };
}
