# ![MCP Logo](https://avatars.githubusercontent.com/u/182288589?s=26&v=4) MCP Emtrafesa

> Un servidor del Protocolo de Contexto de Modelo (MCP) para acceder a los servicios de transporte de autobuses de Emtrafesa en Perú

[![CI](https://github.com/georgegiosue/mcp-emtrafesa/actions/workflows/ci.yml/badge.svg)](https://github.com/georgegiosue/mcp-emtrafesa/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/georgegiosue/mcp-emtrafesa/branch/master/graph/badge.svg)](https://codecov.io/gh/georgegiosue/mcp-emtrafesa)
[![NPM Version](https://img.shields.io/npm/v/mcp-emtrafesa?style=flat&logo=npm&logoColor=red)](https://www.npmjs.com/package/mcp-emtrafesa)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) · **Español**

## Instalación

**Claude Code**

```bash
claude mcp add emtrafesa -- npx -y mcp-emtrafesa@latest
```

**Claude Desktop** — agrega esto a `claude_desktop_config.json` y reinicia:

```json
{
  "mcpServers": {
    "emtrafesa": {
      "command": "npx",
      "args": ["-y", "mcp-emtrafesa@latest"]
    }
  }
}
```

## Cómo se ve

> **Tú:** Necesito ir de Chiclayo a Trujillo esta noche. ¿Qué opciones hay y cuánto cuestan?

> **Claude:** Hay 10 salidas esta noche, pero de las 5:30 PM en adelante están agotadas. La más barata costaba S/ 22, hacía escalas y llegaba 9:45 PM. Por S/ 35 había una directa que llegaba 9:00 PM. ¿Reviso para mañana?

> **Tú:** Revisa mañana, y quiero asiento en el primer piso.

> **Claude:** El de mañana 5:30 PM tiene 48 de 60 asientos libres, pero solo 5 en el primer piso: 64, 65, 67, 68 y 70.

> **Tú:** Búscame los boletos que ya compré — DNI 12345678, correo yo@ejemplo.com.

> **Claude:** Tienes una compra registrada: dos asientos, Trujillo → Lima, S/ 100. ¿Te paso los PDFs?

## Herramientas

| Herramienta | Qué hace | Recibe |
|-------------|----------|--------|
| `get-terminals` | Todas las terminales de Emtrafesa en Perú | — |
| `get-arrival-terminals` | A dónde puedes viajar desde una ciudad | `from` |
| `get-departure-schedules` | Salidas entre dos ciudades | `from`, `to`, `date?` |
| `get-available-seats` | Qué asientos quedan libres en una salida | `from`, `to`, `scheduleId` |
| `get-latest-purchased-tickets` | Tus compras | `DNI`, `email` |
| `get-ticket-pdf` | Un boleto en PDF | `ticketCode` |
| `get-frequently-asked-questions` | Equipaje, menores, adultos mayores, reglas | — |

Cada campo que devuelven las herramientas lleva su propia descripción en el `outputSchema` anunciado, así Claude sabe qué está leyendo sin que tengas que explicarle nada. Si omites `date`, usa hoy en Perú; el formato es `DD/MM/YYYY`.

## Desarrollo

```bash
bun install
bun test
bunx @modelcontextprotocol/inspector bun src/index.ts   # probar las herramientas directamente
```

## Licencia

MIT — ver [LICENSE](LICENSE). Endpoints identificados con ayuda de [@tecncr](https://github.com/tecncr). Dudas y reportes: [GitHub Issues](https://github.com/georgegiosue/mcp-emtrafesa/issues).
