import { describe, expect, it, mock } from "bun:test";
import { expected } from "../../helpers/fixtures";
import { withRepo } from "./helpers";

describe("get-latest-purchased-tickets", () => {
  it("forwards DNI and email to repo and returns JSON text", async () => {
    const { repo, tools } = await withRepo({
      getPurchasedTickets: mock(() => Promise.resolve(expected.tickets)),
    });

    const result = (await tools["get-latest-purchased-tickets"].handler(
      { DNI: "12345678", email: "user@example.com" },
      {},
    )) as {
      content: { type: string; text: string }[];
      structuredContent: unknown;
    };

    expect(result.content[0].type).toBe("text");
    expect(result.structuredContent).toEqual({ tickets: expected.tickets });
    expect(JSON.parse(result.content[0].text)).toEqual({
      tickets: expected.tickets,
    });
    expect(repo.getPurchasedTickets).toHaveBeenCalledWith({
      DNI: "12345678",
      email: "user@example.com",
    });
  });

  it("returns error message when repository throws", async () => {
    const { tools } = await withRepo({
      getPurchasedTickets: mock(() =>
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
