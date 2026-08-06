import { describe, expect, it, mock } from "bun:test";
import { expected } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

const terminals = [expected.firstTerminal, expected.firstArrivalTerminal];

describe("get-arrival-terminals", () => {
  it("resolves the origin city by name and returns its destinations", async () => {
    const { repo, tools } = await withRepo({
      getTerminals: mock(() => Promise.resolve(terminals)),
      getDestinations: mock(() =>
        Promise.resolve([expected.firstArrivalTerminal]),
      ),
    });

    const result = (await tools["get-arrival-terminals"].handler(
      { from: "trujillo" },
      {},
    )) as {
      content: { type: string; text: string }[];
      structuredContent: unknown;
    };

    expect(result.content[0].type).toBe("text");
    expect(result.structuredContent).toEqual({
      arrivalTerminals: [
        {
          name: expected.firstArrivalTerminal.name,
          address: expected.firstArrivalTerminal.address,
        },
      ],
    });
    expect(repo.getDestinations).toHaveBeenCalledWith({
      departureTerminalId: expected.firstTerminal.id,
    });
  });

  it("lists the available cities when the name does not match", async () => {
    const { tools } = await withRepo({
      getTerminals: mock(() => Promise.resolve(terminals)),
    });

    const result = (await tools["get-arrival-terminals"].handler(
      { from: "Cusco" },
      {},
    )) as { content: { type: string; text: string }[] };

    expect(result.content[0].text).toContain('No origin named "Cusco"');
    expect(result.content[0].text).toContain("TRUJILLO");
    expect(result.content[0].text).toContain("CAJAMARCA");
  });

  it("returns error message when repository throws", async () => {
    const { tools } = await withRepo({
      getTerminals: mock(() => Promise.reject(new Error("not found"))),
    });

    const result = (await tools["get-arrival-terminals"].handler(
      { from: "Trujillo" },
      {},
    )) as { content: { type: string; text: string }[] };

    expect(result.content[0].text).toBe("not found");
  });
});
