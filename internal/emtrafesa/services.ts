import { api } from "../../config/api";
import type { FAQ, Terminal } from "./types";

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
