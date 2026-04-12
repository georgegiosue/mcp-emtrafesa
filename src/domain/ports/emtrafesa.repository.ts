import type {
  DepartureSchedule,
  DepartureScheduleParams,
  DepartureTerminalParams,
  FAQ,
  Terminal,
  Ticket,
  TicketDownloadParams,
  TicketLookupParams,
} from "../models/emtrafesa.model";

export interface EmtrafesaRepository {
  getTerminals(): Promise<Terminal[]>;
  getFrequentlyAskedQuestions(): Promise<FAQ[]>;
  getArrivalTerminalsByDepartureTerminal(
    params: DepartureTerminalParams,
  ): Promise<Terminal[]>;
  getDepartureSchedules(
    params: DepartureScheduleParams,
  ): Promise<DepartureSchedule[]>;
  getLatestPurchaseTickets(params: TicketLookupParams): Promise<Ticket[]>;
  downloadTicketPDF(params: TicketDownloadParams): Promise<Buffer>;
}
