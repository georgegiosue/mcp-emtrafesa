import { describe, expect, it, mock } from "bun:test";
import { fixtures } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

describe("get-frequently-asked-questions", () => {
  it("returns JSON text of FAQs on success", async () => {
    const { repo, tools } = withRepo({
      getFrequentlyAskedQuestions: mock(() => Promise.resolve(fixtures.faqs)),
    });

    const result = (await tools["get-frequently-asked-questions"].handler(
      {},
    )) as {
      content: { type: string; text: string }[];
    };

    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toBe(JSON.stringify(fixtures.faqs));
    expect(repo.getFrequentlyAskedQuestions).toHaveBeenCalledTimes(1);
  });

  it("returns error message when repository throws", async () => {
    const { tools } = withRepo({
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
