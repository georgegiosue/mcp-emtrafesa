import { api } from "../../config/api";
import type { DepartureSchedule, FAQ, Terminal } from "./types";

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
