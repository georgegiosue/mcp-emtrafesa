import { api } from "../../config/api";
import type {
  DestinationsParams,
  FAQ,
  Schedule,
  ScheduleParams,
  SeatAvailability,
  SeatAvailabilityParams,
  Terminal,
  Ticket,
  TicketDownloadParams,
  TicketLookupParams,
} from "../../domain/models/emtrafesa.model";
import type { EmtrafesaRepository } from "../../domain/ports/emtrafesa.repository";
import {
  parseFaqs,
  parseSchedules,
  parseSeatAvailability,
  parseTerminals,
} from "./emtrafesa.wire";
import { request } from "./http-client";
import { todayInPeru } from "./peru-date";
import { parseTickets } from "./ticket-html.parser";
import { readTicketPdf } from "./ticket-pdf";

export class EmtrafesaHttpRepository implements EmtrafesaRepository {
  async getTerminals(): Promise<Terminal[]> {
    const response = await request(api.endpoints.terminals);

    return parseTerminals(await response.json());
  }

  async getFrequentlyAskedQuestions(): Promise<FAQ[]> {
    const response = await request(api.endpoints.faqs);

    return parseFaqs(await response.json());
  }

  async getDestinations(params: DestinationsParams): Promise<Terminal[]> {
    const query = new URLSearchParams({ origen: params.departureTerminalId });
    const response = await request(
      `${api.endpoints.arrivalTerminals}?${query}`,
    );

    return parseTerminals(await response.json());
  }

  async getDepartureSchedules(params: ScheduleParams): Promise<Schedule[]> {
    const response = await request(api.endpoints.schedules, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embarque_sucursal_id: params.departureTerminalId,
        desembarque_sucursal_id: params.arrivalTerminalId,
        embarque_fecha: params.date ?? todayInPeru(),
      }),
    });

    return parseSchedules(await response.json());
  }

  async getSeatAvailability(
    params: SeatAvailabilityParams,
  ): Promise<SeatAvailability> {
    const response = await request(api.endpoints.seatMap, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        programacion_id: String(params.scheduleId),
        embarque_sucursal_id: params.departureTerminalId,
        desembarque_sucursal_id: params.arrivalTerminalId,
      }),
    });

    return parseSeatAvailability(await response.json());
  }

  async getPurchasedTickets(params: TicketLookupParams): Promise<Ticket[]> {
    const body = new URLSearchParams({
      Dni: params.DNI,
      Correo: params.email,
    });

    const response = await request(api.endpoints.ticketLookup, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    return parseTickets(await response.text());
  }

  async getTicketPdf(params: TicketDownloadParams): Promise<Buffer> {
    const boletos = `${api.ticketDocumentPrefix},${encodeURIComponent(params.ticketCode)}`;

    const response = await request(
      `${api.endpoints.ticketDownload}?Boletos=${boletos}`,
    );

    return readTicketPdf(await response.arrayBuffer(), params.ticketCode);
  }
}
