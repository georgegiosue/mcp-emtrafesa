# ![MCP Logo](https://avatars.githubusercontent.com/u/182288589?s=26&v=4) MCP Emtrafesa

> A Model Context Protocol (MCP) server for accessing Emtrafesa bus transportation services in Peru

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

### Option 1: Use directly with npx (Recommended)

Add to your MCP client configuration:

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

### Option 2: Clone and run locally

```bash
# Clone the repository
git clone https://github.com/georgegiosue/mcp-emtrafesa.git
cd mcp-emtrafesa

# Install dependencies
bun install

# Start the MCP server
bun run index.ts
```

> **Tip:** Use the MCP Inspector for debugging: `bunx @modelcontextprotocol/inspector bun index.ts`

---

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `get-terminals` | Get all bus terminals in Peru | None |
| `get-arrival-terminal` | Get destination terminals for a given origin | `departureTerminalId` |
| `get-departure-schedules` | Get schedules between two terminals | `departureTerminalId`, `arrivalTerminalId`, `date?` |
| `get-latest-purchased-tickets` | Search your purchased tickets | `DNI`, `email` |
| `download-ticket-pdf` | Download your ticket as a PDF file | `ticketCode` |
| `get-frequently-asked-questions` | Get FAQs about the service | None |

---

## Usage Examples

### Get all terminals

```typescript
const terminals = await client.callTool("get-terminals");
```

### Find schedules from Chiclayo to Trujillo

```typescript
const schedules = await client.callTool("get-departure-schedules", {
  departureTerminalId: "002",
  arrivalTerminalId: "001",
  date: "14/07/2025", // DD/MM/YYYY format
});
```

### Look up your purchased tickets

```typescript
const tickets = await client.callTool("get-latest-purchased-tickets", {
  DNI: "12345678",
  email: "user@example.com",
});
```

### Download your ticket as PDF

```typescript
const pdf = await client.callTool("download-ticket-pdf", {
  ticketCode: "BP01-123456",
});
// Returns a base64-encoded PDF that can be saved or displayed
```

---

## Requirements

- [Bun](https://bun.sh) v1.2.10+ or Node.js v18+
- An MCP-compatible client (Claude Desktop, etc.)

---

## Project Structure

```
mcp-emtrafesa/
├── src/
│   ├── common/         # Shared tools and utilities
│   ├── config/         # API configuration
│   ├── internal/       # Core business logic (services, types)
│   └── lib/            # Helper utilities
├── index.ts            # MCP server entry point
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
