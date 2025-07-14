# ![MCP Logo](https://avatars.githubusercontent.com/u/182288589?s=26&v=4) MCP Emtrafesa

> A Model Context Protocol (MCP) server for accessing Emtrafesa bus transportation services in Peru

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

- **English**: [README.md](README.md) (You are here)
- **Español**: [README.es.md](README.es.md)

**MCP Emtrafesa** is a Model Context Protocol server that provides AI assistants with seamless access to Peru's Emtrafesa bus transportation system. Query terminals, schedules, tickets, and FAQs through standardized MCP tools.

## 🚀 Features

- **🏢 Terminal Management**: Access all bus terminals across Peru
- **📅 Schedule Queries**: Real-time departure and arrival schedules
- **🎫 Ticket Lookup**: Search purchased tickets by DNI and email
- **❓ FAQ Support**: Access frequently asked questions
- **🔍 Route Planning**: Find available routes between terminals
- **🌍 Peru-Specific**: Localized date formats and timezone handling

## 📦 Installation

### Prerequisites

- [Bun](https://bun.sh) v1.2.10 or higher
- Node.js v18+ (for TypeScript support)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/georgegiosue/mcp-emtrafesa.git
cd mcp-emtrafesa

# Install dependencies
bun install

# Start the MCP server
bun run index.ts

# Optional: Start with Model Context Protocol Inspector
bunx @modelcontextprotocol/inspector bun index.ts
```

## 🔧 Usage

### MCP Client Integration

Configure your MCP client to connect to this server:

```json
{
  "mcpServers": {
    "mcp-emtrafesa": {
      "command": "bun",
      "args": ["run", "index.ts"],
      "cwd": "/path/to/mcp-emtrafesa"
    }
  }
}
```

### Available Tools

| Tool                             | Description                          | Parameters                                          |
| -------------------------------- | ------------------------------------ | --------------------------------------------------- |
| `get-terminals`                  | Get all bus terminals in Peru        | None                                                |
| `get-arrival-terminal`           | Get destination terminals for origin | `departureTerminalId`                               |
| `get-departure-schedules`        | Get schedules between terminals      | `departureTerminalId`, `arrivalTerminalId`, `date?` |
| `get-latest-purchased-tickets`   | Search tickets by user info          | `DNI`, `email`                                      |
| `get-frequently-asked-questions` | Get FAQs about the service           | None                                                |

### Example Queries

```typescript
// Get all terminals
const terminals = await client.callTool("get-terminals");

// Find routes from Chiclayo to Trujillo
const schedules = await client.callTool("get-departure-schedules", {
  departureTerminalId: "002",
  arrivalTerminalId: "001",
  date: "14/07/2025", // DD/MM/YYYY format
});

// Look up purchased tickets
const tickets = await client.callTool("get-latest-purchased-tickets", {
  DNI: "12345678",
  email: "user@example.com",
});
```

## Project Structure

```
mcp-emtrafesa/
├── 📁 config/          # API configuration
│   └── api.ts          # Headers and base settings
├── 📁 internal/        # Core business logic
│   └── emtrafesa/      # Emtrafesa-specific code
│       ├── services.ts # API client functions
│       └── types.ts    # TypeScript type definitions
├── 📁 sandbox/         # Development utilities
│   └── post-consulta.html # HTML parsing reference
├── 📄 index.ts         # MCP server entry point
├── 📄 package.json     # Dependencies and scripts
├── 📄 tsconfig.json    # TypeScript configuration
└── 📄 biome.json       # Code formatting rules
```

## 🛡️ API Integration

### Supported Endpoints

- **Terminals**: `GET /Home/GetSucursales`
- **Destinations**: `GET /Home/GetSucursalesDestino`
- **Schedules**: `POST /Home/GetItinerario` (JSON)
- **Tickets**: `POST /Consulta/PostConsulta` (Form-encoded)
- **FAQs**: `GET /Home/GetPreguntasFrecuentes`

### Data Handling

- **JSON APIs**: Direct deserialization for structured data
- **HTML Scraping**: Cheerio-based parsing for ticket information
- **Date Formats**: Peru timezone (America/Lima) with DD/MM/YYYY format
- **Error Handling**: Graceful degradation with JSON error responses

## 🧪 Development

### Code Formatting

```bash
# Format code with Biome
bun run format

# Check formatting without writing
bunx biome check
```

### Type Safety

- Strict TypeScript configuration with `noUncheckedIndexedAccess`
- Zod schemas for runtime validation
- Exact API field mapping in type definitions

### Testing HTML Parsing

Use the reference file for testing changes:

```bash
# View the HTML structure reference
open sanbox/post-consulta.html
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Format** your code (`bun run format`)
4. **Commit** your changes (`git commit -m 'Add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Emtrafesa](https://emtrafesa.pe) for providing the transportation API
- [Model Context Protocol](https://modelcontextprotocol.io) for the MCP specification
- [@tecncr](https://github.com/tecncr) for API endpoint insights
- [Bun](https://bun.sh) for the fast JavaScript runtime

## Support

- **Issues**: [GitHub Issues](https://github.com/georgegiosue/mcp-emtrafesa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/georgegiosue/mcp-emtrafesa/discussions)
- **Email**: [peraldonamoc@gmail.com](mailto:peraldonamoc@gmail.com)
