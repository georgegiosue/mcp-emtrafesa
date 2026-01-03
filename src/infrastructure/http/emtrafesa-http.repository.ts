import * as cheerio from "cheerio";
import { api } from "../../config/api";
import type {
  DepartureSchedule,
  FAQ,
  Terminal,
  Ticket,
} from "../../domain/models/emtrafesa.model";
import type { EmtrafesaRepository } from "../../domain/ports/emtrafesa.repository";

export class EmtrafesaHttpRepository implements EmtrafesaRepository {
  async getTerminals(): Promise<Terminal[]> {
    const req = await fetch("https://emtrafesa.pe/Home/GetSucursales", {
      headers: api.headers,
    });
    return (await req.json()) as Terminal[];
  }

  async getFrequentlyAskedQuestions(): Promise<FAQ[]> {
    const req = await fetch(
      "https://emtrafesa.pe/Home/GetPreguntasFrecuentes",
      {
        headers: api.headers,
      },
    );
    return (await req.json()) as FAQ[];
  }

  async getArrivalTerminalsByDepartureTerminal(params: {
    departureTerminalId: string;
  }): Promise<Terminal[]> {
    const req = await fetch(
      `https://emtrafesa.pe/Home/GetSucursalesDestino?origen=${params.departureTerminalId}`,
      { headers: api.headers },
    );
    return (await req.json()) as Terminal[];
  }

  async getDepartureSchedules(params: {
    departureTerminalId: string;
    arrivalTerminalId: string;
    date?: string;
  }): Promise<DepartureSchedule[]> {
    const formattedDate =
      params.date ||
      new Intl.DateTimeFormat("es-PE", {
        timeZone: "America/Lima",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date());

    const req = await fetch("https://emtrafesa.pe/Home/GetItinerario", {
      method: "POST",
      headers: { ...api.headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        embarque_sucursal_id: params.departureTerminalId,
        desembarque_sucursal_id: params.arrivalTerminalId,
        embarque_fecha: formattedDate,
      }),
    });

    return (await req.json()) as DepartureSchedule[];
  }

  async getLatestPurchaseTickets(params: {
    DNI: string;
    email: string;
  }): Promise<Ticket[]> {
    const body = new URLSearchParams();
    body.append("Dni", params.DNI);
    body.append("Correo", params.email);

    const req = await fetch("https://emtrafesa.pe/Consulta/PostConsulta", {
      method: "POST",
      headers: {
        ...api.headers,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const html = await req.text();
    const $ = cheerio.load(html);

    return $(".card-body")
      .map((_, card) => {
        const $card = $(card);

        return {
          dateTime: $card.find("h5").first().text().trim(),
          seats: $card
            .find(".text-muted.small span")
            .toArray()
            .map((el) => $(el).text().trim())
            .filter((txt) => /^\d+$/.test(txt)),
          ticketsCodes: $card
            .find("p.text-truncate")
            .text()
            .trim()
            .split("|")
            .map((code) => code.trim()),
          price: $card.find("h4").first().text().trim(),
          operationNumber: $card
            .find("h6.text-success")
            .text()
            .replace(/[^0-9]/g, "")
            .trim(),
          origin: $card.find("button.btn-sm").first().text().trim(),
          destination: $card.find("button.btn-sm").last().text().trim(),
        };
      })
      .get();
  }

  async downloadTicketPDF(params: { ticketCode: string }): Promise<Buffer> {
    const req = await fetch(
      `https://www.emtrafesa.pe/Home/ComprobanteDescarga?Boletos=3,BP01,${params.ticketCode}`,
      { headers: api.headers },
    );

    if (!req.ok) {
      throw new Error(`Failed to download ticket PDF: ${req.statusText}`);
    }

    const arrayBuffer = await req.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
