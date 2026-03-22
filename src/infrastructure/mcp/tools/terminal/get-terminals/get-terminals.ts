import { errorResponse } from "../../error";
import type { Tool } from "../../tool";

export const tool: Tool = {
  name: "get-terminals",
  config: {
    description:
      "Retrieve all Emtrafesa bus terminals across Peru. Returns a list of terminal objects each with an Id, Nombre (name), and Direccion (address). Call this tool first to discover valid terminal IDs before querying destinations or schedules. The Id field is required as input for get-arrival-terminals and get-departure-schedules.",
  },
  async handler(_params, repository) {
    try {
      const terminals = await repository.getTerminals();
      return { content: [{ type: "text", text: JSON.stringify(terminals) }] };
    } catch (error) {
      return errorResponse(error);
    }
  },
};
