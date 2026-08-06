import type {
  DestinationsParams,
  FAQ,
  Schedule,
  ScheduleParams,
  SeatAvailability,
  SeatAvailabilityParams,
  Terminal,
  Ticket,
  TicketDownloadParams,
  TicketLookupParams,
} from "../models/emtrafesa.model";

export interface EmtrafesaRepository {
  getTerminals(): Promise<Terminal[]>;
  getFrequentlyAskedQuestions(): Promise<FAQ[]>;
  getDestinations(params: DestinationsParams): Promise<Terminal[]>;
  getDepartureSchedules(params: ScheduleParams): Promise<Schedule[]>;
  getSeatAvailability(
    params: SeatAvailabilityParams,
  ): Promise<SeatAvailability>;
  getPurchasedTickets(params: TicketLookupParams): Promise<Ticket[]>;
  getTicketPdf(params: TicketDownloadParams): Promise<Buffer>;
}
