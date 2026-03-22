import { describe, expect, it, mock } from "bun:test";
import { fixtures } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

describe("get-arrival-terminals", () => {
  it("passes departureTerminalId to repo and returns JSON text", async () => {
    const { repo, tools } = await withRepo({
      getArrivalTerminalsByDepartureTerminal: mock(() =>
        Promise.resolve(fixtures.arrivalTerminals),
      ),
    });

    const result = (await tools["get-arrival-terminals"].handler(
      { departureTerminalId: "001" },
      {},
    )) as { content: { type: string; text: string }[] };

    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toBe(
      JSON.stringify(fixtures.arrivalTerminals),
    );
    expect(repo.getArrivalTerminalsByDepartureTerminal).toHaveBeenCalledWith({
      departureTerminalId: "001",
    });
  });

  it("returns error message when repository throws", async () => {
    const { tools } = await withRepo({
      getArrivalTerminalsByDepartureTerminal: mock(() =>
        Promise.reject(new Error("not found")),
      ),
    });

    const result = (await tools["get-arrival-terminals"].handler(
      { departureTerminalId: "001" },
      {},
    )) as { content: { type: string; text: string }[] };

    expect(result.content[0].text).toBe("not found");
  });
});
