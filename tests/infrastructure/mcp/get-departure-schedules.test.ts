import { describe, expect, it, mock } from "bun:test";
import { expected } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

const origin = expected.firstTerminal;
const destination = expected.firstArrivalTerminal;

function routeRepo(overrides = {}) {
  return withRepo({
    getTerminals: mock(() => Promise.resolve([origin])),
    getDestinations: mock(() => Promise.resolve([destination])),
    getDepartureSchedules: mock(() => Promise.resolve(expected.schedules)),
    ...overrides,
  });
}

describe("get-departure-schedules", () => {
  it("resolves both cities by name and forwards the resolved ids", async () => {
    const { repo, tools } = await routeRepo();

    const result = (await tools["get-departure-schedules"].handler(
      { from: "Trujillo", to: "Cajamarca", date: "22/03/2026" },
      {},
    )) as {
      content: { type: string; text: string }[];
      structuredContent: unknown;
    };

    expect(result.structuredContent).toEqual({ schedules: expected.schedules });
    expect(repo.getDestinations).toHaveBeenCalledWith({
      departureTerminalId: origin.id,
    });
    expect(repo.getDepartureSchedules).toHaveBeenCalledWith({
      departureTerminalId: origin.id,
      arrivalTerminalId: destination.id,
      date: "22/03/2026",
    });
  });

  it("matches city names ignoring case and accents", async () => {
    const { repo, tools } = await routeRepo();

    await tools["get-departure-schedules"].handler(
      { from: "trujillo", to: "cajamárca" },
      {},
    );

    expect(repo.getDepartureSchedules).toHaveBeenCalledWith({
      departureTerminalId: origin.id,
      arrivalTerminalId: destination.id,
      date: undefined,
    });
  });

  it("reports which destinations exist when the route is not served", async () => {
    const { tools } = await routeRepo();

    const result = (await tools["get-departure-schedules"].handler(
      { from: "Trujillo", to: "Cusco" },
      {},
    )) as { content: { type: string; text: string }[] };

    expect(result.content[0].text).toContain(
      `No destination reachable from ${origin.name} named "Cusco"`,
    );
    expect(result.content[0].text).toContain(destination.name);
  });

  it("returns error message when repository throws", async () => {
    const { tools } = await routeRepo({
      getDepartureSchedules: mock(() =>
        Promise.reject(new Error("service unavailable")),
      ),
    });

    const result = (await tools["get-departure-schedules"].handler(
      { from: "Trujillo", to: "Cajamarca" },
      {},
    )) as { content: { type: string; text: string }[] };

    expect(result.content[0].text).toBe("service unavailable");
  });
});
