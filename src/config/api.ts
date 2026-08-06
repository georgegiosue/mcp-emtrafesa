export const api = {
  baseUrl: "https://www.emtrafesa.pe",
  timeoutMs: 15_000,
  ticketDocumentPrefix: "3,BP01",
  headers: {
    "User-Agent": "mcp-emtrafesa",
  },
  endpoints: {
    terminals: "/Home/GetSucursales",
    faqs: "/Home/GetPreguntasFrecuentes",
    arrivalTerminals: "/Home/GetSucursalesDestino",
    schedules: "/Home/GetItinerario",
    seatMap: "/Home/GetCroquis",
    ticketLookup: "/Consulta/PostConsulta",
    ticketDownload: "/Home/ComprobanteDescarga",
  },
} as const;
