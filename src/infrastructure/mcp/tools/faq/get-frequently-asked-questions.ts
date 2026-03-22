import { errorResponse } from "../error";
import type { Tool } from "../tool";

export const tool: Tool = {
  name: "get-frequently-asked-questions",
  config: {
    description:
      "Retrieve the official Emtrafesa FAQ list covering topics such as terminal locations, ticket purchasing, passenger categories (children, seniors, etc.), luggage policies, and service rules. Use this to answer general questions about how Emtrafesa operates without needing to query schedules or tickets.",
  },
  async handler(_params, repository) {
    try {
      const faq = await repository.getFrequentlyAskedQuestions();
      return { content: [{ type: "text", text: JSON.stringify(faq) }] };
    } catch (error) {
      return errorResponse(error);
    }
  },
};
