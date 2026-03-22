import { describe, expect, it, mock } from "bun:test";
import { fixtures } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

describe("get-departure-schedules", () => {
  it("forwards all params including date to repo and returns JSON text", async () => {
    const { repo, tools } = await withRepo({
      getDepartureSchedules: mock(() => Promise.resolve(fixtures.schedules)),
    });

    const result = (await tools["get-departure-schedules"].handler(
      {
        departureTerminalId: "001",
        arrivalTerminalId: "003",
        date: "22/03/2026",
      },
      {},
    )) as { content: { type: string; text: string }[] };

    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toBe(JSON.stringify(fixtures.schedules));
    expect(repo.getDepartureSchedules).toHaveBeenCalledWith({
      departureTerminalId: "001",
      arrivalTerminalId: "003",
      date: "22/03/2026",
    });
  });

  it("passes date as undefined when not provided", async () => {
    const { repo, tools } = await withRepo({
      getDepartureSchedules: mock(() => Promise.resolve([])),
    });

    await tools["get-departure-schedules"].handler(
      { departureTerminalId: "001", arrivalTerminalId: "003" },
      {},
    );

    expect(repo.getDepartureSchedules).toHaveBeenCalledWith({
      departureTerminalId: "001",
      arrivalTerminalId: "003",
      date: undefined,
    });
  });

  it("returns error message when repository throws", async () => {
    const { tools } = await withRepo({
      getDepartureSchedules: mock(() =>
        Promise.reject(new Error("service unavailable")),
      ),
    });

    const result = (await tools["get-departure-schedules"].handler(
      { departureTerminalId: "001", arrivalTerminalId: "003" },
      {},
    )) as { content: { type: string; text: string }[] };

    expect(result.content[0].text).toBe("service unavailable");
  });
});
