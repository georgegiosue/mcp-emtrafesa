import { describe, expect, it, mock } from "bun:test";
import { expected } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

const origin = expected.firstTerminal;
const destination = expected.firstArrivalTerminal;

const seatAvailability = {
  totalSeats: 60,
  availableSeats: 2,
  available: [
    { number: 64, deck: 1 },
    { number: 12, deck: 2 },
  ],
};

function seatRepo(overrides = {}) {
  return withRepo({
    getTerminals: mock(() => Promise.resolve([origin])),
    getDestinations: mock(() => Promise.resolve([destination])),
    getSeatAvailability: mock(() => Promise.resolve(seatAvailability)),
    ...overrides,
  });
}

describe("get-available-seats", () => {
  it("resolves both cities and forwards the schedule id", async () => {
    const { repo, tools } = await seatRepo();

    const result = (await tools["get-available-seats"].handler(
      { from: "Trujillo", to: "Cajamarca", scheduleId: 202607208 },
      {},
    )) as { structuredContent: unknown };

    expect(result.structuredContent).toEqual({ seatAvailability });
    expect(repo.getSeatAvailability).toHaveBeenCalledWith({
      scheduleId: 202607208,
      departureTerminalId: origin.id,
      arrivalTerminalId: destination.id,
    });
  });

  it("reports the unknown city instead of calling the seat map", async () => {
    const { repo, tools } = await seatRepo();

    const result = (await tools["get-available-seats"].handler(
      { from: "Cusco", to: "Cajamarca", scheduleId: 1 },
      {},
    )) as { content: { text: string }[] };

    expect(result.content[0].text).toContain('No origin named "Cusco"');
    expect(repo.getSeatAvailability).not.toHaveBeenCalled();
  });
});
