import type {
  DepartureSchedule,
  FAQ,
  Terminal,
  Ticket,
} from "../models/emtrafesa.model";

export interface EmtrafesaRepository {
  getTerminals(): Promise<Terminal[]>;
  getFrequentlyAskedQuestions(): Promise<FAQ[]>;
  getArrivalTerminalsByDepartureTerminal(params: {
    departureTerminalId: string;
  }): Promise<Terminal[]>;
  getDepartureSchedules(params: {
    departureTerminalId: string;
    arrivalTerminalId: string;
    date?: string;
  }): Promise<DepartureSchedule[]>;
  getLatestPurchaseTickets(params: {
    DNI: string;
    email: string;
  }): Promise<Ticket[]>;
  downloadTicketPDF(params: { ticketCode: string }): Promise<Buffer>;
}
