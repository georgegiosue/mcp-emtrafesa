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

## 🚀 Características

- **🏢 Gestión de Terminales**: Accede a todos los terminales de autobuses en todo el Perú
- **📅 Consulta de Horarios**: Horarios de salida y llegada en tiempo real
- **🎫 Búsqueda de Boletos**: Busca boletos comprados por DNI y correo electrónico
- **❓ Soporte de FAQ**: Accede a preguntas frecuentes
- **🔍 Planificación de Rutas**: Encuentra rutas disponibles entre terminales
- **🌍 Específico para Perú**: Formatos de fecha localizados y manejo de zona horaria

## 📦 Instalación

### Prerrequisitos

- [Bun](https://bun.sh) v1.2.10 o superior
- Node.js v18+ (para soporte de TypeScript)

### Inicio Rápido

```bash
# Clona el repositorio
git clone https://github.com/georgegiosue/mcp-emtrafesa.git
cd mcp-emtrafesa

# Instala las dependencias
bun install

# Inicia el servidor MCP
bun run index.ts

# Opcional: Inicia con el Inspector del Protocolo de Contexto de Modelo
bunx @modelcontextprotocol/inspector bun index.ts
```

## 🔧 Uso

### Integración con Cliente MCP

Configura tu cliente MCP para conectarse a este servidor:

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

### Herramientas Disponibles

| Herramienta                      | Descripción                                        | Parámetros                                          |
| -------------------------------- | -------------------------------------------------- | --------------------------------------------------- |
| `get-terminals`                  | Obtiene todos los terminales de autobuses del Perú | Ninguno                                             |
| `get-arrival-terminal`           | Obtiene terminales de destino para origen          | `departureTerminalId`                               |
| `get-departure-schedules`        | Obtiene horarios entre terminales                  | `departureTerminalId`, `arrivalTerminalId`, `date?` |
| `get-latest-purchased-tickets`   | Busca boletos por información del usuario          | `DNI`, `email`                                      |
| `get-frequently-asked-questions` | Obtiene FAQs sobre el servicio                     | Ninguno                                             |

### Ejemplos de Consultas

```typescript
// Obtener todos los terminales
const terminals = await client.callTool("get-terminals");

// Buscar rutas de Chiclayo a Trujillo
const schedules = await client.callTool("get-departure-schedules", {
  departureTerminalId: "002",
  arrivalTerminalId: "001",
  date: "14/07/2025", // formato DD/MM/YYYY
});

// Buscar boletos comprados
const tickets = await client.callTool("get-latest-purchased-tickets", {
  DNI: "12345678",
  email: "usuario@ejemplo.com",
});
```

## Estructura del Proyecto

```
mcp-emtrafesa/
├── 📁 config/          # Configuración de API
│   └── api.ts          # Cabeceras y configuraciones base
├── 📁 internal/        # Lógica de negocio principal
│   └── emtrafesa/      # Código específico de Emtrafesa
│       ├── services.ts # Funciones del cliente API
│       └── types.ts    # Definiciones de tipos TypeScript
├── 📁 sandbox/         # Utilidades de desarrollo
│   └── post-consulta.html # Referencia para análisis HTML
├── 📄 index.ts         # Punto de entrada del servidor MCP
├── 📄 package.json     # Dependencias y scripts
├── 📄 tsconfig.json    # Configuración de TypeScript
└── 📄 biome.json       # Reglas de formateo de código
```

## 🛡️ Integración de API

### Endpoints Soportados

- **Terminales**: `GET /Home/GetSucursales`
- **Destinos**: `GET /Home/GetSucursalesDestino`
- **Horarios**: `POST /Home/GetItinerario` (JSON)
- **Boletos**: `POST /Consulta/PostConsulta` (Codificado en formulario)
- **FAQs**: `GET /Home/GetPreguntasFrecuentes`

### Manejo de Datos

- **APIs JSON**: Deserialización directa para datos estructurados
- **Web Scraping HTML**: Análisis basado en Cheerio para información de boletos
- **Formatos de Fecha**: Zona horaria de Perú (America/Lima) con formato DD/MM/YYYY
- **Manejo de Errores**: Degradación elegante con respuestas de error JSON

## 🧪 Desarrollo

### Formateo de Código

```bash
# Formatear código con Biome
bun run format

# Verificar formateo sin escribir
bunx biome check
```

### Seguridad de Tipos

- Configuración estricta de TypeScript con `noUncheckedIndexedAccess`
- Esquemas Zod para validación en tiempo de ejecución
- Mapeo exacto de campos de API en definiciones de tipos

### Pruebas de Análisis HTML

Usa el archivo de referencia para probar cambios:

```bash
# Ver la referencia de estructura HTML
open sandbox/post-consulta.html
```

## 🤝 Contribuciones

1. **Haz fork** del repositorio
2. **Crea** una rama de característica (`git checkout -b feature/caracteristica-increible`)
3. **Formatea** tu código (`bun run format`)
4. **Confirma** tus cambios (`git commit -m 'Agrega característica increíble'`)
5. **Envía** a la rama (`git push origin feature/caracteristica-increible`)
6. **Abre** un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## Reconocimientos

- [Emtrafesa](https://emtrafesa.pe) por proporcionar la API de transporte
- [Model Context Protocol](https://modelcontextprotocol.io) por la especificación MCP
- [@tecncr](https://github.com/tecncr) por los insights de endpoints de API
- [Bun](https://bun.sh) por el runtime rápido de JavaScript

## Soporte

- **Issues**: [GitHub Issues](https://github.com/georgegiosue/mcp-emtrafesa/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/georgegiosue/mcp-emtrafesa/discussions)
- **Email**: [peraldonamoc@gmail.com](mailto:peraldonamoc@gmail.com)
