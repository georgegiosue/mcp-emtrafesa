import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";
import type {
  DepartureSchedule,
  FAQ,
  Terminal,
  Ticket,
} from "../../src/domain/models/emtrafesa.model";

const FIXTURES_DIR = join(import.meta.dir, "../fixtures");

export function loadJson<T>(filename: string): T {
  return JSON.parse(readFileSync(join(FIXTURES_DIR, filename), "utf-8")) as T;
}

export function loadText(filename: string): string {
  return readFileSync(join(FIXTURES_DIR, filename), "utf-8");
}

export function parseTicketsFromHtml(filename: string): Ticket[] {
  const $ = cheerio.load(loadText(filename));
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

export const fixtures = {
  terminals: loadJson<Terminal[]>("GetSucursales.json"),
  faqs: loadJson<FAQ[]>("GetPreguntasFrecuentes.json"),
  arrivalTerminals: loadJson<Terminal[]>("GetSucursalesDestino_001.json"),
  schedules: loadJson<DepartureSchedule[]>("GetItinerario_001_003.json"),
  tickets: parseTicketsFromHtml("PostConsulta.html"),
};
