import * as cheerio from "cheerio";
import {
  type Ticket,
  ticketsSchema,
} from "../../domain/models/emtrafesa.model";

export function parseTickets(html: string): Ticket[] {
  const $ = cheerio.load(html);

  const tickets = $(".card-body")
    .map((_, card) => {
      const $card = $(card);

      return {
        dateTime: $card.find("h5").first().text().trim(),
        seats: $card
          .find(".text-muted.small span")
          .toArray()
          .map((el) => $(el).text().trim())
          .filter((txt) => /^\d+$/.test(txt)),
        ticketsCodes: $card
          .find("p.text-truncate")
          .text()
          .split("|")
          .map((code) => code.trim())
          .filter((code) => code.length > 0),
        price: $card.find("h4").first().text().trim(),
        operationNumber: $card
          .find("h6.text-success")
          .text()
          .replace(/[^0-9]/g, "")
          .trim(),
        origin: $card.find("button.btn-sm").first().text().trim(),
        destination: $card.find("button.btn-sm").last().text().trim(),
      };
    })
    .get();

  return ticketsSchema.parse(tickets);
}
