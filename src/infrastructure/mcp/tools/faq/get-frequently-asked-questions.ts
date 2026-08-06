import { z } from "zod";
import { faqsSchema } from "../../../../domain/models/emtrafesa.model";
import { READ_ONLY } from "../annotations";
import { errorResponse } from "../error";
import type { ToolRegistrar } from "../registrar";

const DESCRIPTION =
  "Retrieve the official Emtrafesa FAQ list covering topics such as terminal locations, ticket purchasing, passenger categories (children, seniors, etc.), luggage policies, and service rules. Use this to answer general questions about how Emtrafesa operates without needing to query schedules or tickets.";

const outputSchema = z.object({
  faqs: faqsSchema,
});

export const register: ToolRegistrar = (server, repository) => {
  server.registerTool(
    "get-frequently-asked-questions",
    {
      title: "Get Frequently Asked Questions",
      description: DESCRIPTION,
      outputSchema,
      annotations: READ_ONLY,
    },
    async () => {
      try {
        const output = { faqs: await repository.getFrequentlyAskedQuestions() };

        return {
          content: [{ type: "text", text: JSON.stringify(output) }],
          structuredContent: output,
        };
      } catch (error) {
        return errorResponse(error);
      }
    },
  );
};
