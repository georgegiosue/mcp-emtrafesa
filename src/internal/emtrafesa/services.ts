import * as cheerio from "cheerio";
import { api } from "../../config/api";
import type { DepartureSchedule, FAQ, Terminal, Ticket } from "./types";

export async function getTerminals(): Promise<Terminal[]> {
  const req = await fetch("https://emtrafesa.pe/Home/GetSucursales", {
    headers: api.headers,
  });

  const res = (await req.json()) as Terminal[];

  return res;
}

export async function getFrequentlyAskedQuestions(): Promise<FAQ[]> {
  const req = await fetch("https://emtrafesa.pe/Home/GetPreguntasFrecuentes", {
    headers: api.headers,
  });

  const res = (await req.json()) as FAQ[];

  return res;
}

export async function getArrivalTerminalsByDepartureTerminal({
  departureTerminalId,
}: {
  departureTerminalId: string;
}): Promise<Terminal[]> {
  const req = await fetch(
    `https://emtrafesa.pe/Home/GetSucursalesDestino?origen=${departureTerminalId}`,
    {
      headers: api.headers,
    },
  );

  const res = (await req.json()) as Terminal[];

  return res;
}

// Thanks https://github.com/tecncr
export async function getDepartureSchedules({
  departureTerminalId,
  arrivalTerminalId,
  date,
}: {
  departureTerminalId: string;
  arrivalTerminalId: string;
  date?: string;
}): Promise<DepartureSchedule[]> {
  const formattedDate = date
    ? date
    : new Intl.DateTimeFormat("es-PE", {
        timeZone: "America/Lima",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date());

  const req = await fetch(`https://emtrafesa.pe/Home/GetItinerario`, {
    method: "POST",
    headers: {
      ...api.headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embarque_sucursal_id: departureTerminalId,
      desembarque_sucursal_id: arrivalTerminalId,
      embarque_fecha: formattedDate,
    }),
  });

  const res = (await req.json()) as DepartureSchedule[];

  return res;
}

export async function getLatestPurchaseTickets({
  DNI,
  email,
}: {
  DNI: string;
  email: string;
}): Promise<Ticket[]> {
  const body = new URLSearchParams();
  body.append("Dni", DNI);
  body.append("Correo", email);

  const req = await fetch(`https://emtrafesa.pe/Consulta/PostConsulta`, {
    method: "POST",
    headers: {
      ...api.headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const res = await req.text();

  const $ = cheerio.load(res);

  const tickets: Ticket[] = $(".card-body")
    .map((_, card) => {
      const $card = $(card);

      // a) Date and time
      const dateTimeRaw = $card.find("h5").first().text().trim();

      // b) Seats
      const seats = $card
        .find(".text-muted.small span")
        // Appear in pairs ["Asiento", "•", "32", "Asiento", "•", "31"]
        .toArray()
        .map((el) => $(el).text().trim())
        .filter((txt) => /^\d+$/.test(txt)); // only numbers

      // c) Tickets codes - separated by "|"
      const ticketsCodes = $card
        .find("p.text-truncate")
        .text()
        .trim()
        .split("|")
        .map((code) => code.trim());

      // d) Price
      const price = $card.find("h4").first().text().trim();

      // e) Operation number
      const operation = $card
        .find("h6.text-success")
        .text()
        .replace(/[^0-9]/g, "") // extract only numbers
        .trim();

      // f) Departure and arrival terminals
      const [origin, destination] = $card
        .find("button.btn-sm")
        .toArray()
        .map((btn) => $(btn).text().trim());

      return {
        dateTime: dateTimeRaw,
        seats,
        ticketsCodes,
        price,
        operationNumber: operation,
        origin,
        destination,
      };
    })
    .get();

  return tickets;
}

export async function downloadTicketPDF({
  tiketCode,
}: {
  tiketCode: string;
}): Promise<Buffer> {
  const req = await fetch(
    `https://www.emtrafesa.pe/Home/ComprobanteDescarga?Boletos=3,BP01,${tiketCode}`,
    {
      headers: api.headers,
    },
  );

  if (!req.ok) {
    throw new Error(`Failed to download ticket PDF: ${req.statusText}`);
  }

  const arrayBuffer = await req.arrayBuffer();

  return Buffer.from(arrayBuffer);
}
