# MCP Emtrafesa

Servidor MCP para consultar los buses de Emtrafesa en Perú: terminales, horarios, asientos libres y tus boletos comprados.

[![CI](https://github.com/georgegiosue/mcp-emtrafesa/actions/workflows/ci.yml/badge.svg)](https://github.com/georgegiosue/mcp-emtrafesa/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/georgegiosue/mcp-emtrafesa/branch/master/graph/badge.svg)](https://codecov.io/gh/georgegiosue/mcp-emtrafesa)
[![NPM Version](https://img.shields.io/npm/v/mcp-emtrafesa?style=flat&logo=npm&logoColor=red)](https://www.npmjs.com/package/mcp-emtrafesa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) · **Español**

## Conectar

**Claude Desktop y claude.ai** — Configuración → Conectores → Agregar conector personalizado, sin autenticación:

```
https://mcp-emtrafesa.georgegiosue.dev/mcp
```

**Claude Code**

```bash
claude mcp add --transport http emtrafesa https://mcp-emtrafesa.georgegiosue.dev/mcp
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

Cada campo que devuelven las herramientas se describe a sí mismo, así que Claude sabe qué está leyendo sin que tengas que explicarle nada. Pídele las cosas por nombre de ciudad; si no dices fecha, usa hoy en Perú.

## Licencia

MIT — ver [LICENSE](LICENSE). Endpoints identificados con ayuda de [@tecncr](https://github.com/tecncr). Dudas y reportes: [GitHub Issues](https://github.com/georgegiosue/mcp-emtrafesa/issues). Vulnerabilidades de seguridad: repórtalas en privado, ver [SECURITY.es.md](SECURITY.es.md).
