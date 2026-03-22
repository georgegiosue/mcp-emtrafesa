# ![MCP Logo](https://avatars.githubusercontent.com/u/182288589?s=26&v=4) MCP Emtrafesa

> A Model Context Protocol (MCP) server for accessing Emtrafesa bus transportation services in Peru

[![CI](https://github.com/georgegiosue/mcp-emtrafesa/actions/workflows/ci.yml/badge.svg)](https://github.com/georgegiosue/mcp-emtrafesa/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/georgegiosue/mcp-emtrafesa/branch/master/graph/badge.svg)](https://codecov.io/gh/georgegiosue/mcp-emtrafesa)
[![NPM Version](https://img.shields.io/npm/v/mcp-emtrafesa?style=flat&logo=npm&logoColor=red)](https://www.npmjs.com/package/mcp-emtrafesa)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

- **English**: [README.md](README.md) (You are here)
- **Español**: [README.es.md](README.es.md)

**MCP Emtrafesa** is a Model Context Protocol server that provides AI assistants with seamless access to Peru's Emtrafesa bus transportation system. Query terminals, schedules, tickets, and FAQs through standardized MCP tools.

---

## What can you do with this MCP?

- **Find bus terminals** across Peru
- **Check schedules** between any two cities
- **Look up your purchased tickets** using your DNI and email
- **Download your ticket as PDF** for printing or sharing
- **Get answers** to frequently asked questions

---

## Quick Start

### Option 1: Claude Desktop (Recommended)

Open your Claude Desktop configuration file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the following entry:

```json
{
  "mcpServers": {
    "mcp-emtrafesa": {
      "command": "npx",
      "args": ["mcp-emtrafesa@latest"]
    }
  }
}
```

Restart Claude Desktop. You'll see an MCP indicator in the bottom-right corner of the chat input when the server is connected.

### Option 2: Clone and run locally

```bash
# Clone the repository
git clone https://github.com/georgegiosue/mcp-emtrafesa.git
cd mcp-emtrafesa

# Install dependencies
bun install
```

Then point your MCP client to the local server:

```json
{
  "mcpServers": {
    "mcp-emtrafesa": {
      "command": "bun",
      "args": ["/absolute/path/to/mcp-emtrafesa/src/index.ts"]
    }
  }
}
```

> **Tip:** Use the MCP Inspector for debugging: `bunx @modelcontextprotocol/inspector bun src/index.ts`

---

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `get-terminals` | Get all bus terminals in Peru | None |
| `get-arrival-terminals` | Get destination terminals for a given origin | `departureTerminalId` |
| `get-departure-schedules` | Get schedules between two terminals | `departureTerminalId`, `arrivalTerminalId`, `date?` |
| `get-latest-purchased-tickets` | Search your purchased tickets | `DNI`, `email` |
| `get-ticket-pdf` | Download your ticket as a PDF file | `ticketCode` |
| `get-frequently-asked-questions` | Get FAQs about the service | None |

---

## Usage Examples

Once connected, you can ask Claude naturally:

- *"What bus terminals does Emtrafesa have?"*
- *"What schedules are available from Chiclayo to Trujillo on 14/07/2025?"*
- *"Look up my tickets with DNI 12345678 and email user@example.com"*
- *"Download the PDF for ticket BP01-123456"*

---

## Requirements

- [Bun](https://bun.sh) v1.2.10+ or Node.js v18+
- An MCP-compatible client (Claude Desktop, etc.)

---

## Project Structure

```
mcp-emtrafesa/
├── src/
│   ├── config/                        # API configuration
│   ├── domain/
│   │   ├── models/                    # Domain model interfaces
│   │   └── ports/                     # Repository interface (contract)
│   ├── infrastructure/
│   │   ├── http/                      # HTTP repository implementation
│   │   └── mcp/
│   │       └── tools/
│   │           ├── index.ts           # Auto-discovers and registers all tools
│   │           ├── tool.ts            # Tool interface + register() helper
│   │           ├── error.ts           # Shared errorResponse()
│   │           ├── faq/
│   │           │   └── get-frequently-asked-questions/
│   │           │       ├── constants.ts
│   │           │       └── get-frequently-asked-questions.ts
│   │           ├── schedule/
│   │           │   └── get-departure-schedules/
│   │           │       ├── constants.ts
│   │           │       ├── schema.ts
│   │           │       ├── types.ts
│   │           │       └── get-departure-schedules.ts
│   │           ├── terminal/
│   │           │   ├── get-terminals/
│   │           │   │   ├── constants.ts
│   │           │   │   └── get-terminals.ts
│   │           │   └── get-arrival-terminals/
│   │           │       ├── constants.ts
│   │           │       ├── schema.ts
│   │           │       ├── types.ts
│   │           │       └── get-arrival-terminals.ts
│   │           └── ticket/
│   │               ├── get-latest-purchased-tickets/
│   │               │   ├── constants.ts
│   │               │   ├── schema.ts
│   │               │   ├── types.ts
│   │               │   └── get-latest-purchased-tickets.ts
│   │               └── get-ticket-pdf/
│   │                   ├── constants.ts
│   │                   ├── schema.ts
│   │                   ├── types.ts
│   │                   └── get-ticket-pdf.ts
│   ├── shared/                        # Shared utilities
│   └── index.ts                       # MCP server entry point
├── package.json
└── tsconfig.json
```

---

## Development

```bash
# Format code
bun run format

# Check formatting
bunx biome check
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Format your code (`bun run format`)
4. Commit your changes
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Emtrafesa](https://emtrafesa.pe) - Transportation API provider
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
- [@tecncr](https://github.com/tecncr) - API endpoint insights
- [Bun](https://bun.sh) - Fast JavaScript runtime

---

## Support

- [GitHub Issues](https://github.com/georgegiosue/mcp-emtrafesa/issues)
- [GitHub Discussions](https://github.com/georgegiosue/mcp-emtrafesa/discussions)
- Email: [peraldonamoc@gmail.com](mailto:peraldonamoc@gmail.com)
