import { afterEach, describe, expect, it, mock } from "bun:test";
import { EmtrafesaHttpRepository } from "../../../src/infrastructure/http/emtrafesa-http.repository";
import {
  mockFetch,
  mockFetchBinary,
  mockFetchError,
  mockFetchHtml,
  mockFetchRejecting,
} from "../../helpers/fetch";
import { expected, loadText } from "../../helpers/fixtures";

const BASE_URL = "https://www.emtrafesa.pe";

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
        `${BASE_URL}/Home/GetSucursales`,
        expect.objectContaining({
          headers: expect.objectContaining({ "User-Agent": "mcp-emtrafesa" }),
          signal: expect.any(AbortSignal),
        }),
      );
      expect(terminals).toHaveLength(expected.terminalCount);
      expect(terminals[0]).toEqual(expected.firstTerminal);
    });
  });

  describe("getFrequentlyAskedQuestions", () => {
    it("fetches from GetPreguntasFrecuentes and returns FAQ[]", async () => {
      const fetchSpy = mockFetch(loadText("GetPreguntasFrecuentes.json"));

      const faqs = await repo.getFrequentlyAskedQuestions();

      expect(fetchSpy).toHaveBeenCalledWith(
        `${BASE_URL}/Home/GetPreguntasFrecuentes`,
        expect.objectContaining({
          headers: expect.objectContaining({ "User-Agent": "mcp-emtrafesa" }),
        }),
      );
      expect(faqs).toHaveLength(expected.faqCount);
      expect(faqs[0]?.question).toBe(expected.firstFaqQuestion);
      expect(faqs[0]?.answer).toContain("Los mayores de 5 años");
    });
  });

  describe("getDestinations", () => {
    it("fetches from GetSucursalesDestino with the correct origin id", async () => {
      const fetchSpy = mockFetch(loadText("GetSucursalesDestino_001.json"));

      const arrivals = await repo.getDestinations({
        departureTerminalId: "001",
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${BASE_URL}/Home/GetSucursalesDestino?origen=001`,
        expect.objectContaining({
          headers: expect.objectContaining({ "User-Agent": "mcp-emtrafesa" }),
        }),
      );
      expect(arrivals).toHaveLength(expected.arrivalTerminalCount);
      expect(arrivals[0]).toEqual(expected.firstArrivalTerminal);
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
        `${BASE_URL}/Home/GetItinerario`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            embarque_sucursal_id: "001",
            desembarque_sucursal_id: "003",
            embarque_fecha: "22/03/2026",
          }),
        }),
      );
      expect(schedules).toEqual(expected.schedules);
    });

    it("keeps only the surcharged seats belonging to this trip's bus layout", async () => {
      mockFetch(
        JSON.stringify([
          {
            Programacion_Id: 1,
            Bus_Croquis_Id: "Z2",
            Embarque_FechaHora: "/Date(1774224000000)/",
            Desembarque_FechaHora: "/Date(1774257600000)/",
            Embarque_FechaHora_Str: "07:00 PM",
            Desembarque_FechaHora_Str: "04:20 AM",
            EsDirecto: true,
            EsDirecto_Str: "Directo",
            Servicio_Descripcion: "C - Fenix",
            Bus_AsientosLibres: 5,
            Bus_Pisos: 2,
            Precio_Piso1: 100,
            Precio_Piso2: 75,
            ArrIncremento: [
              { IdPlanoBus: "Z2", NumeroAsiento: 63, Nivel: 1 },
              { IdPlanoBus: "D2", NumeroAsiento: 66, Nivel: 1 },
              { IdPlanoBus: "Z2", NumeroAsiento: 72, Nivel: 2 },
            ],
          },
        ]),
      );

      const [schedule] = await repo.getDepartureSchedules({
        departureTerminalId: "001",
        arrivalTerminalId: "003",
      });

      expect(schedule?.seatsWithSurcharge).toEqual([
        { seatNumber: 63, deck: 1 },
        { seatNumber: 72, deck: 2 },
      ]);
    });

    it("omits the upper-deck fare on single-deck buses", async () => {
      mockFetch(
        JSON.stringify([
          {
            Programacion_Id: 1,
            Bus_Croquis_Id: "R",
            Embarque_FechaHora: "/Date(1774224000000)/",
            Desembarque_FechaHora: "/Date(1774257600000)/",
            Embarque_FechaHora_Str: "07:00 PM",
            Desembarque_FechaHora_Str: "04:20 AM",
            EsDirecto: false,
            EsDirecto_Str: "Escalas",
            Servicio_Descripcion: "D - Normal",
            Bus_AsientosLibres: 4,
            Bus_Pisos: 1,
            Precio_Piso1: 22,
            Precio_Piso2: 0,
          },
        ]),
      );

      const [schedule] = await repo.getDepartureSchedules({
        departureTerminalId: "001",
        arrivalTerminalId: "003",
      });

      expect(schedule?.priceFirstDeck).toBe(22);
      expect(schedule?.priceSecondDeck).toBeUndefined();
    });

    it("rejects a date Emtrafesa did not serialise as /Date(ms)/", async () => {
      mockFetch(
        JSON.stringify([
          {
            Programacion_Id: 1,
            Bus_Croquis_Id: "Z2",
            Embarque_FechaHora: "2026-03-23",
            Desembarque_FechaHora: "/Date(1774257600000)/",
            Embarque_FechaHora_Str: "07:00 PM",
            Desembarque_FechaHora_Str: "04:20 AM",
            EsDirecto: true,
            EsDirecto_Str: "Directo",
            Servicio_Descripcion: "C - Fenix",
            Bus_AsientosLibres: 5,
            Bus_Pisos: 2,
            Precio_Piso1: 100,
            Precio_Piso2: 75,
          },
        ]),
      );

      expect(
        repo.getDepartureSchedules({
          departureTerminalId: "001",
          arrivalTerminalId: "003",
        }),
      ).rejects.toThrow(
        "Emtrafesa sent an unrecognised date in Embarque_FechaHora: 2026-03-23",
      );
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

  describe("getSeatAvailability", () => {
    it("keeps only seat objects and lists the free ones without passenger data", async () => {
      const fetchSpy = mockFetch(
        JSON.stringify([
          {
            Objeto_Tipo_Id: 2,
            Asiento_Numero: 0,
            PisoNumero: 2,
            Asiento_EstaOcupado: false,
          },
          {
            Objeto_Tipo_Id: 1,
            Asiento_Numero: 1,
            PisoNumero: 2,
            Asiento_EstaOcupado: true,
            Asiento_PasajeroSexo: "F",
          },
          {
            Objeto_Tipo_Id: 1,
            Asiento_Numero: 2,
            PisoNumero: 2,
            Asiento_EstaOcupado: false,
            Asiento_PasajeroSexo: "\u0000",
          },
          {
            Objeto_Tipo_Id: 1,
            Asiento_Numero: 64,
            PisoNumero: 1,
            Asiento_EstaOcupado: false,
            Asiento_PasajeroSexo: "\u0000",
          },
        ]),
      );

      const seats = await repo.getSeatAvailability({
        scheduleId: 202607208,
        departureTerminalId: "002",
        arrivalTerminalId: "3",
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${BASE_URL}/Home/GetCroquis`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            programacion_id: "202607208",
            embarque_sucursal_id: "002",
            desembarque_sucursal_id: "3",
          }),
        }),
      );
      expect(seats).toEqual({
        totalSeats: 3,
        availableSeats: 2,
        available: [
          { number: 2, deck: 2 },
          { number: 64, deck: 1 },
        ],
      });
      expect(JSON.stringify(seats)).not.toContain("Sexo");
    });
  });

  describe("getPurchasedTickets", () => {
    it("posts to PostConsulta, parses HTML and returns Ticket[]", async () => {
      const fetchSpy = mockFetchHtml(loadText("PostConsulta.html"));

      const tickets = await repo.getPurchasedTickets({
        DNI: "12345678",
        email: "user@example.com",
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${BASE_URL}/Consulta/PostConsulta`,
        expect.objectContaining({
          method: "POST",
          body: "Dni=12345678&Correo=user%40example.com",
        }),
      );
      expect(tickets).toEqual(expected.tickets);
    });

    it("returns empty array when no tickets are found", async () => {
      mockFetchHtml("<html><body></body></html>");

      const tickets = await repo.getPurchasedTickets({
        DNI: "00000000",
        email: "nobody@example.com",
      });

      expect(tickets).toHaveLength(0);
    });

    it("drops cards whose ticket-code element is missing instead of emitting an empty code", async () => {
      mockFetchHtml(
        `<div class="card-body"><h5>01/01/2026</h5><h4>S/ 10</h4><h6 class="text-success">Op 123</h6></div>`,
      );

      const [ticket] = await repo.getPurchasedTickets({
        DNI: "12345678",
        email: "user@example.com",
      });

      expect(ticket?.ticketsCodes).toEqual([]);
    });
  });

  describe("getTicketPdf", () => {
    it("fetches from the correct URL and returns a Buffer with PDF bytes", async () => {
      const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
      const fetchSpy = mockFetchBinary(pdfBytes.buffer);

      const buffer = await repo.getTicketPdf({ ticketCode: "0001" });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${BASE_URL}/Home/ComprobanteDescarga?Boletos=3,BP01,0001`,
        expect.objectContaining({
          headers: expect.objectContaining({ "User-Agent": "mcp-emtrafesa" }),
        }),
      );
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer[0]).toBe(0x25);
      expect(buffer[1]).toBe(0x50);
    });

    it("rejects a 200 response whose body is not actually a PDF", async () => {
      // Emtrafesa answers an unknown code with 200 + `Content-Type:
      // application/pdf` and a .NET error object as the body.
      mockFetchBinary(
        new TextEncoder().encode(
          '{"message":"La cadena de entrada no tiene el formato correcto.","source":"mscorlib"}',
        ).buffer as ArrayBuffer,
      );

      expect(repo.getTicketPdf({ ticketCode: "NOPE" })).rejects.toThrow(
        "Emtrafesa did not return a PDF for ticket NOPE: La cadena de entrada no tiene el formato correcto.",
      );
    });

    it("encodes the caller-supplied code but keeps the key separators literal", async () => {
      const fetchSpy = mockFetchBinary(
        new TextEncoder().encode("%PDF-1.4").buffer as ArrayBuffer,
      );

      await repo.getTicketPdf({ ticketCode: "A B&C" });

      expect(fetchSpy).toHaveBeenCalledWith(
        `${BASE_URL}/Home/ComprobanteDescarga?Boletos=3,BP01,A%20B%26C`,
        expect.anything(),
      );
    });
  });

  describe("error handling", () => {
    it("throws with status and path when the response is not ok", async () => {
      mockFetchError(404, "Not Found");

      expect(repo.getTicketPdf({ ticketCode: "INVALID" })).rejects.toThrow(
        "Emtrafesa returned 404 Not Found for /Home/ComprobanteDescarga?Boletos=3,BP01,INVALID",
      );
    });

    it("throws on a non-ok JSON endpoint instead of parsing the error page", async () => {
      mockFetchError(500, "Internal Server Error");

      expect(repo.getTerminals()).rejects.toThrow(
        "Emtrafesa returned 500 Internal Server Error for /Home/GetSucursales",
      );
    });

    it("throws a validation error when the payload has the wrong shape", async () => {
      mockFetch(JSON.stringify([{ Id: 1 }]));

      expect(repo.getTerminals()).rejects.toThrow();
    });

    it("reports a timeout rather than a raw abort", async () => {
      const timeout = new Error("The operation timed out.");
      timeout.name = "TimeoutError";
      mockFetchRejecting(timeout);

      expect(repo.getTerminals()).rejects.toThrow(
        "Emtrafesa did not respond within 15000ms",
      );
    });

    it("reports an unreachable host", async () => {
      mockFetchRejecting(new TypeError("fetch failed"));

      expect(repo.getTerminals()).rejects.toThrow(
        "Could not reach Emtrafesa at /Home/GetSucursales",
      );
    });
  });
});
