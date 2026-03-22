import { errorResponse } from "../../error";
import type { Tool } from "../../tool";
import { DESCRIPTION, TOOL_NAME } from "./constants";

export const tool: Tool = {
  name: TOOL_NAME,
  config: { description: DESCRIPTION },
  async handler(_params, repository) {
    try {
      const faq = await repository.getFrequentlyAskedQuestions();
      return { content: [{ type: "text", text: JSON.stringify(faq) }] };
    } catch (error) {
      return errorResponse(error);
    }
  },
};
