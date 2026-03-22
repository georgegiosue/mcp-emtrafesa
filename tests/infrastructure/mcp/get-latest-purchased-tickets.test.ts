import { describe, expect, it, mock } from "bun:test";
import { fixtures } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

describe("get-latest-purchased-tickets", () => {
  it("forwards DNI and email to repo and returns JSON text", async () => {
    const { repo, tools } = withRepo({
      getLatestPurchaseTickets: mock(() => Promise.resolve(fixtures.tickets)),
    });

    const result = (await tools["get-latest-purchased-tickets"].handler(
      { DNI: "12345678", email: "user@example.com" },
      {},
    )) as { content: { type: string; text: string }[] };

    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toBe(JSON.stringify(fixtures.tickets));
    expect(repo.getLatestPurchaseTickets).toHaveBeenCalledWith({
      DNI: "12345678",
      email: "user@example.com",
    });
  });

  it("returns error message when repository throws", async () => {
    const { tools } = withRepo({
      getLatestPurchaseTickets: mock(() =>
        Promise.reject(new Error("invalid credentials")),
      ),
    });

    const result = (await tools["get-latest-purchased-tickets"].handler(
      { DNI: "12345678", email: "user@example.com" },
      {},
    )) as { content: { type: string; text: string }[] };

    expect(result.content[0].text).toBe("invalid credentials");
  });
});
