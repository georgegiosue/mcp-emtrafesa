import { describe, expect, it, mock } from "bun:test";
import { expected } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

const expectedFaqs = [
  { question: expected.firstFaqQuestion, answer: "Los mayores de 5 años..." },
];

describe("get-frequently-asked-questions", () => {
  it("returns JSON text of FAQs on success", async () => {
    const { repo, tools } = await withRepo({
      getFrequentlyAskedQuestions: mock(() => Promise.resolve(expectedFaqs)),
    });

    const result = (await tools["get-frequently-asked-questions"].handler(
      {},
    )) as {
      content: { type: string; text: string }[];
      structuredContent: unknown;
    };

    expect(result.content[0].type).toBe("text");
    expect(result.structuredContent).toEqual({ faqs: expectedFaqs });
    expect(JSON.parse(result.content[0].text)).toEqual({ faqs: expectedFaqs });
    expect(repo.getFrequentlyAskedQuestions).toHaveBeenCalledTimes(1);
  });

  it("returns error message when repository throws", async () => {
    const { tools } = await withRepo({
      getFrequentlyAskedQuestions: mock(() =>
        Promise.reject(new Error("timeout")),
      ),
    });

    const result = (await tools["get-frequently-asked-questions"].handler(
      {},
    )) as {
      content: { type: string; text: string }[];
    };

    expect(result.content[0].text).toBe("timeout");
  });
});
