import { afterEach, describe, expect, it, mock } from "bun:test";
import { EmtrafesaHttpRepository } from "../../../src/infrastructure/http/emtrafesa-http.repository";
import {
  mockFetch,
  mockFetchBinary,
  mockFetchError,
  mockFetchHtml,
} from "../../helpers/fetch";
import { fixtures, loadText } from "../../helpers/fixtures";

describe("EmtrafesaHttpRepository", () => {
  const repo = new EmtrafesaHttpRepository();

  afterEach(() => {
    mock.restore();
  });

  describe("getTerminals", () => {
    it("fetches from GetSucursales and returns Terminal[]", async () => {
      const fetchSpy = mockFetch(loadText("GetSucursales.json"));

      const terminals = await repo.getTerminals();

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://emtrafesa.pe/Home/GetSucursales",
        expect.objectContaining({ headers: { "User-Agent": "mcp-emtrafesa" } }),
      );
      expect(terminals).toEqual(fixtures.terminals);
    });
  });

  describe("getFrequentlyAskedQuestions", () => {
    it("fetches from GetPreguntasFrecuentes and returns FAQ[]", async () => {
      const fetchSpy = mockFetch(loadText("GetPreguntasFrecuentes.json"));

      const faqs = await repo.getFrequentlyAskedQuestions();

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://emtrafesa.pe/Home/GetPreguntasFrecuentes",
        expect.objectContaining({ headers: { "User-Agent": "mcp-emtrafesa" } }),
      );
      expect(faqs).toEqual(fixtures.faqs);
    });
  });

  describe("getArrivalTerminalsByDepartureTerminal", () => {
    it("fetches from GetSucursalesDestino with the correct origin id", async () => {
      const fetchSpy = mockFetch(loadText("GetSucursalesDestino_001.json"));

      const arrivals = await repo.getArrivalTerminalsByDepartureTerminal({
        departureTerminalId: "001",
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://emtrafesa.pe/Home/GetSucursalesDestino?origen=001",
        expect.objectContaining({ headers: { "User-Agent": "mcp-emtrafesa" } }),
      );
      expect(arrivals).toEqual(fixtures.arrivalTerminals);
    });
  });

  describe("getDepartureSchedules", () => {
    it("posts to GetItinerario with the correct body and returns DepartureSchedule[]", async () => {
      const fetchSpy = mockFetch(loadText("GetItinerario_001_003.json"));

      const schedules = await repo.getDepartureSchedules({
        departureTerminalId: "001",
        arrivalTerminalId: "003",
        date: "22/03/2026",
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://emtrafesa.pe/Home/GetItinerario",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            embarque_sucursal_id: "001",
            desembarque_sucursal_id: "003",
            embarque_fecha: "22/03/2026",
          }),
        }),
      );
      expect(schedules).toEqual(fixtures.schedules);
    });

    it("uses today's date in Peruvian locale when date is not provided", async () => {
      const fetchSpy = mockFetch(loadText("GetItinerario_001_003.json"));

      await repo.getDepartureSchedules({
        departureTerminalId: "001",
        arrivalTerminalId: "003",
      });

      const body = JSON.parse(
        (fetchSpy.mock.calls[0] as [string, RequestInit])[1].body as string,
      );
      expect(body.embarque_fecha).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe("getLatestPurchaseTickets", () => {
    it("posts to PostConsulta, parses HTML and returns Ticket[]", async () => {
      const fetchSpy = mockFetchHtml(loadText("PostConsulta.html"));

      const tickets = await repo.getLatestPurchaseTickets({
        DNI: "12345678",
        email: "user@example.com",
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://emtrafesa.pe/Consulta/PostConsulta",
        expect.objectContaining({ method: "POST" }),
      );
      expect(tickets).toEqual(fixtures.tickets);
    });

    it("returns empty array when no tickets are found", async () => {
      mockFetchHtml("<html><body></body></html>");

      const tickets = await repo.getLatestPurchaseTickets({
        DNI: "00000000",
        email: "nobody@example.com",
      });

      expect(tickets).toHaveLength(0);
    });
  });

  describe("downloadTicketPDF", () => {
    it("fetches from the correct URL and returns a Buffer with PDF bytes", async () => {
      const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
      const fetchSpy = mockFetchBinary(pdfBytes.buffer);

      const buffer = await repo.downloadTicketPDF({ ticketCode: "0001" });

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://www.emtrafesa.pe/Home/ComprobanteDescarga?Boletos=3,BP01,0001",
        expect.objectContaining({ headers: { "User-Agent": "mcp-emtrafesa" } }),
      );
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer[0]).toBe(0x25);
      expect(buffer[1]).toBe(0x50);
    });

    it("throws when the response is not ok", async () => {
      mockFetchError(404, "Not Found");

      expect(repo.downloadTicketPDF({ ticketCode: "INVALID" })).rejects.toThrow(
        "Failed to download ticket PDF: Not Found",
      );
    });
  });
});
