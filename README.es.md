# ![MCP Logo](https://avatars.githubusercontent.com/u/182288589?s=26&v=4) MCP Emtrafesa

> Un servidor del Protocolo de Contexto de Modelo (MCP) para acceder a los servicios de transporte de autobuses de Emtrafesa en Perú

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

### Opción 1: Usar directamente con npx (Recomendado)

Agrega a la configuración de tu cliente MCP:

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

### Opción 2: Clonar y ejecutar localmente

```bash
# Clona el repositorio
git clone https://github.com/georgegiosue/mcp-emtrafesa.git
cd mcp-emtrafesa

# Instala las dependencias
bun install

# Inicia el servidor MCP
bun run index.ts
```

> **Tip:** Usa el Inspector MCP para depuración: `bunx @modelcontextprotocol/inspector bun index.ts`

---

## Herramientas Disponibles

| Herramienta | Descripción | Parámetros |
|-------------|-------------|------------|
| `get-terminals` | Obtiene todos los terminales de buses del Perú | Ninguno |
| `get-arrival-terminal` | Obtiene terminales de destino para un origen | `departureTerminalId` |
| `get-departure-schedules` | Obtiene horarios entre dos terminales | `departureTerminalId`, `arrivalTerminalId`, `date?` |
| `get-latest-purchased-tickets` | Busca tus boletos comprados | `DNI`, `email` |
| `get-ticket-pdf` | Descarga tu boleto como archivo PDF | `ticketCode` |
| `get-frequently-asked-questions` | Obtiene preguntas frecuentes del servicio | Ninguno |

---

## Ejemplos de Uso

### Obtener todos los terminales

```typescript
const terminals = await client.callTool("get-terminals");
```

### Buscar horarios de Chiclayo a Trujillo

```typescript
const schedules = await client.callTool("get-departure-schedules", {
  departureTerminalId: "002",
  arrivalTerminalId: "001",
  date: "14/07/2025", // formato DD/MM/YYYY
});
```

### Ver tus boletos comprados

```typescript
const tickets = await client.callTool("get-latest-purchased-tickets", {
  DNI: "12345678",
  email: "usuario@ejemplo.com",
});
```

### Descargar tu boleto en PDF

```typescript
const pdf = await client.callTool("get-ticket-pdf", {
  ticketCode: "BP01-123456",
});
// Devuelve un PDF codificado en base64 que puedes guardar o mostrar
```

---

## Requisitos

- [Bun](https://bun.sh) v1.2.10+ o Node.js v18+
- Un cliente compatible con MCP (Claude Desktop, etc.)

---

## Estructura del Proyecto

```
mcp-emtrafesa/
├── src/
│   ├── common/         # Herramientas y utilidades compartidas
│   ├── config/         # Configuración de API
│   ├── internal/       # Lógica de negocio (servicios, tipos)
│   └── lib/            # Utilidades auxiliares
├── index.ts            # Punto de entrada del servidor MCP
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
