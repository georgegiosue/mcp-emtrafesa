import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getBranches } from "./internal/emtrafesa/services";
import type { Branch } from "./internal/emtrafesa/types";

const server = new McpServer({
  name: "mcp-emtrafesa",
  version: "1.0.0",
});

server.registerTool(
  "get-branches",
  {
    title: "Get Branches",
    description: "Get branches throughout the country",
  },
  async () => {
    const branches: Branch[] = await getBranches();
    const response = branches.map((b) => {
      return {
        Nombre: b.Nombre,
        Direccion: b.Direccion,
      };
    });

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
