export const SERVER_INSTRUCTIONS = `Emtrafesa is a Peruvian intercity bus operator. This server exposes its public data read-only.

Ask for schedules directly with city names — get-departure-schedules({ from: "Chiclayo", to: "Trujillo" }) resolves the route itself. There is no need to look anything up first, and no ids are involved.

get-available-seats shows which individual seats are free on one departure; it takes the scheduleId that get-departure-schedules returned.

get-terminals lists every city Emtrafesa serves, and get-arrival-terminals answers "where can I go from here". Reach for them when the traveller is exploring, or when a city name came back unmatched.

Ticket lookup is a separate chain and needs the passenger's DNI plus the email used at purchase:
1. get-latest-purchased-tickets - returns a ticketsCodes array per purchase.
2. get-ticket-pdf - one call per code; returns the PDF as a base64 resource.

get-frequently-asked-questions answers general policy questions (luggage, passenger categories, service rules) without touching schedules or tickets.

All data is scraped from emtrafesa.pe and is read-only; this server never books, modifies, or cancels anything.`;
