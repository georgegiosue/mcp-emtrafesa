# ![MCP Logo](https://avatars.githubusercontent.com/u/182288589?s=26&v=4) MCP Emtrafesa

> Un servidor del Protocolo de Contexto de Modelo (MCP) para acceder a los servicios de transporte de autobuses de Emtrafesa en Perú

[![CI](https://github.com/georgegiosue/mcp-emtrafesa/actions/workflows/ci.yml/badge.svg)](https://github.com/georgegiosue/mcp-emtrafesa/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/georgegiosue/mcp-emtrafesa/branch/master/graph/badge.svg)](https://codecov.io/gh/georgegiosue/mcp-emtrafesa)
[![NPM Version](https://img.shields.io/npm/v/mcp-emtrafesa?style=flat&logo=npm&logoColor=red)](https://www.npmjs.com/package/mcp-emtrafesa)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

- **English**: [README.md](README.md)
- **Español**: [README.es.md](README.es.md) (Estás aquí)

**MCP Emtrafesa** es un servidor del Protocolo de Contexto de Modelo que proporciona a los asistentes de IA acceso fluido al sistema de transporte de autobuses Emtrafesa de Perú. Consulta terminales, horarios, boletos y preguntas frecuentes a través de herramientas MCP estandarizadas.

---

## ¿Qué puedes hacer con este MCP?

- **Buscar terminales** de buses en todo el Perú
- **Consultar horarios** entre cualquier par de ciudades
- **Ver tus boletos comprados** usando tu DNI y correo electrónico
- **Descargar tu boleto en PDF** para imprimir o compartir
- **Obtener respuestas** a preguntas frecuentes

---

## Inicio Rápido

### Opción 1: Claude Desktop (Recomendado)

Abre el archivo de configuración de Claude Desktop:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Agrega la siguiente entrada:

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

Reinicia Claude Desktop. Verás un indicador MCP en la esquina inferior derecha del chat cuando el servidor esté conectado.

### Opción 2: Clonar y ejecutar localmente

```bash
# Clona el repositorio
git clone https://github.com/georgegiosue/mcp-emtrafesa.git
cd mcp-emtrafesa

# Instala las dependencias
bun install
```

Luego apunta tu cliente MCP al servidor local:

```json
{
  "mcpServers": {
    "mcp-emtrafesa": {
      "command": "bun",
      "args": ["/ruta/absoluta/a/mcp-emtrafesa/src/index.ts"]
    }
  }
}
```

> **Tip:** Usa el Inspector MCP para depuración: `bunx @modelcontextprotocol/inspector bun src/index.ts`

---

## Herramientas Disponibles

| Herramienta | Descripción | Parámetros |
|-------------|-------------|------------|
| `get-terminals` | Obtiene todos los terminales de buses del Perú | Ninguno |
| `get-arrival-terminals` | Obtiene terminales de destino para un origen | `departureTerminalId` |
| `get-departure-schedules` | Obtiene horarios entre dos terminales | `departureTerminalId`, `arrivalTerminalId`, `date?` |
| `get-latest-purchased-tickets` | Busca tus boletos comprados | `DNI`, `email` |
| `get-ticket-pdf` | Descarga tu boleto como archivo PDF | `ticketCode` |
| `get-frequently-asked-questions` | Obtiene preguntas frecuentes del servicio | Ninguno |

---

## Ejemplos de Uso

Una vez conectado, puedes preguntarle a Claude de forma natural:

- *"¿Qué terminales de buses tiene Emtrafesa?"*
- *"¿Qué horarios hay de Chiclayo a Trujillo el 14/07/2025?"*
- *"Busca mis boletos con DNI 12345678 y correo usuario@ejemplo.com"*
- *"Descarga el PDF del boleto BP01-123456"*

---

## Requisitos

- [Bun](https://bun.sh) v1.2.10+ o Node.js v18+
- Un cliente compatible con MCP (Claude Desktop, etc.)

---

## Estructura del Proyecto

```
mcp-emtrafesa/
├── src/
│   ├── config/                # Configuración de API
│   ├── domain/                # Capa de dominio
│   │   ├── models/            # Modelos del dominio
│   │   └── ports/             # Interfaces de repositorios
│   ├── infrastructure/        # Capa de infraestructura
│   │   ├── http/              # Implementaciones de repositorios HTTP
│   │   └── mcp/               # Herramientas del servidor MCP
│   ├── shared/                # Utilidades compartidas
│   └── index.ts               # Punto de entrada del servidor MCP
├── package.json
└── tsconfig.json
```

---

## Desarrollo

```bash
# Formatear código
bun run format

# Verificar formateo
bunx biome check
```

---

## Contribuciones

1. Haz fork del repositorio
2. Crea una rama de característica (`git checkout -b feature/nueva-caracteristica`)
3. Formatea tu código (`bun run format`)
4. Confirma tus cambios
5. Abre un Pull Request

---

## Licencia

Licencia MIT - ver [LICENSE](LICENSE) para más detalles.

---

## Reconocimientos

- [Emtrafesa](https://emtrafesa.pe) - Proveedor de la API de transporte
- [Model Context Protocol](https://modelcontextprotocol.io) - Especificación MCP
- [@tecncr](https://github.com/tecncr) - Insights de endpoints de API
- [Bun](https://bun.sh) - Runtime rápido de JavaScript

---

## Soporte

- [GitHub Issues](https://github.com/georgegiosue/mcp-emtrafesa/issues)
- [GitHub Discussions](https://github.com/georgegiosue/mcp-emtrafesa/discussions)
- Email: [peraldonamoc@gmail.com](mailto:peraldonamoc@gmail.com)
