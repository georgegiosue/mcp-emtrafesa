export const TOOL_NAME = "get-arrival-terminals";

export const DESCRIPTION =
  "Retrieve all available destination terminals reachable from a given departure terminal. Call get-terminals first to obtain a valid departureTerminalId. Use the Id values from the returned list as the arrivalTerminalId when calling get-departure-schedules.";

export const SCHEMA_DESCRIPTIONS = {
  departureTerminalId:
    "The unique identifier of the origin (departure) terminal. Obtain this from the Id field returned by get-terminals.",
} as const;
