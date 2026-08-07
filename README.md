# MCP Emtrafesa

MCP server for Emtrafesa buses in Peru: terminals, schedules, free seats and the tickets you already bought.

[![CI](https://github.com/georgegiosue/mcp-emtrafesa/actions/workflows/ci.yml/badge.svg)](https://github.com/georgegiosue/mcp-emtrafesa/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/georgegiosue/mcp-emtrafesa/branch/master/graph/badge.svg)](https://codecov.io/gh/georgegiosue/mcp-emtrafesa)
[![NPM Version](https://img.shields.io/npm/v/mcp-emtrafesa?style=flat&logo=npm&logoColor=red)](https://www.npmjs.com/package/mcp-emtrafesa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English** · [Español](README.es.md)

## Connect

**Claude Desktop and claude.ai** — Settings → Connectors → Add custom connector, no authentication:

```
https://mcp-emtrafesa.georgegiosue.dev/mcp
```

**Claude Code**

```bash
claude mcp add --transport http emtrafesa https://mcp-emtrafesa.georgegiosue.dev/mcp
```

## What it looks like

> **You:** I need to get from Chiclayo to Trujillo tonight. What are my options and how much?

> **Claude:** There are 10 departures tonight, but everything from 5:30 PM onward is sold out. The cheapest was S/ 22 — it makes stops and arrives 9:45 PM. For S/ 35 there was a direct one arriving 9:00 PM. Want me to check tomorrow?

> **You:** Check tomorrow, and I want a lower-deck seat.

> **Claude:** Tomorrow's 5:30 PM has 48 of 60 seats free, but only 5 on the lower deck: 64, 65, 67, 68 and 70.

> **You:** Pull up the tickets I already bought — DNI 12345678, email me@example.com.

> **Claude:** One purchase on file: two seats, Trujillo → Lima, S/ 100. Want the PDFs?

## Tools

| Tool | Does | Takes |
|------|------|-------|
| `get-terminals` | Every Emtrafesa terminal in Peru | — |
| `get-arrival-terminals` | Where you can travel to from a city | `from` |
| `get-departure-schedules` | Departures between two cities | `from`, `to`, `date?` |
| `get-available-seats` | Which seats are free on one departure | `from`, `to`, `scheduleId` |
| `get-latest-purchased-tickets` | Your purchases | `DNI`, `email` |
| `get-ticket-pdf` | One ticket as a PDF | `ticketCode` |
| `get-frequently-asked-questions` | Luggage, minors, seniors, service rules | — |

Every field a tool returns describes itself, so Claude knows what it is reading without you explaining anything. Ask by city name; leave the date out and it means today in Peru.

## License

MIT — see [LICENSE](LICENSE). Endpoint insights from [@tecncr](https://github.com/tecncr). Issues and questions: [GitHub Issues](https://github.com/georgegiosue/mcp-emtrafesa/issues). Security vulnerabilities: report them privately, see [SECURITY.md](SECURITY.md).
