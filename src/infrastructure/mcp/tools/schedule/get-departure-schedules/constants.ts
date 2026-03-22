export const TOOL_NAME = "get-departure-schedules";

export const DESCRIPTION =
  "Retrieve available bus departure schedules between two Emtrafesa terminals. Returns schedule objects including departure time, arrival time, service class, available seats per floor, ticket prices, and whether the service is direct. If no date is provided, defaults to today in Peru time (America/Lima timezone). Call get-terminals and get-arrival-terminals first to obtain valid terminal IDs.";

export const SCHEMA_DESCRIPTIONS = {
  departureTerminalId:
    "The unique identifier of the origin terminal. Obtain from the Id field returned by get-terminals.",
  arrivalTerminalId:
    "The unique identifier of the destination terminal. Obtain from the Id field returned by get-arrival-terminals for the selected departure terminal.",
  date: "Travel date in DD/MM/YYYY format (e.g. '25/12/2025'). If omitted, defaults to today in Peru time (America/Lima). Cannot be a past date.",
} as const;
