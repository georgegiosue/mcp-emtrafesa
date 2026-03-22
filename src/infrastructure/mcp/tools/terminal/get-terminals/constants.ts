export const TOOL_NAME = "get-terminals";

export const DESCRIPTION =
  "Retrieve all Emtrafesa bus terminals across Peru. Returns a list of terminal objects each with an Id, Nombre (name), and Direccion (address). Call this tool first to discover valid terminal IDs before querying destinations or schedules. The Id field is required as input for get-arrival-terminals and get-departure-schedules.";
