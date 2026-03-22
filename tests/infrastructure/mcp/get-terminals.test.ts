import { describe, expect, it, mock } from "bun:test";
import { fixtures } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

describe("get-terminals", () => {
  it("returns JSON text of terminals on success", async () => {
    const { repo, tools } = await withRepo({
      getTerminals: mock(() => Promise.resolve(fixtures.terminals)),
    });

    const result = (await tools["get-terminals"].handler({})) as {
      content: { type: string; text: string }[];
    };

    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toBe(JSON.stringify(fixtures.terminals));
    expect(repo.getTerminals).toHaveBeenCalledTimes(1);
  });

  it("returns error message when repository throws an Error", async () => {
    const { tools } = await withRepo({
      getTerminals: mock(() => Promise.reject(new Error("network failure"))),
    });

    const result = (await tools["get-terminals"].handler({})) as {
      content: { type: string; text: string }[];
    };

    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toBe("network failure");
  });

  it("returns 'unknown error' when repository throws a non-Error value", async () => {
    const { tools } = await withRepo({
      getTerminals: mock(() => Promise.reject("oops")),
    });

    const result = (await tools["get-terminals"].handler({})) as {
      content: { type: string; text: string }[];
    };

    expect(result.content[0].text).toBe("unknown error");
  });
});
