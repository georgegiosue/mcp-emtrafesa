import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  getBranches,
  getfrequentlyAskedQuestions,
} from "./internal/emtrafesa/services";
import type { Branch, FAQ } from "./internal/emtrafesa/types";

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
    try {
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
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              error instanceof Error ? error.message : "unknow error"
            ),
          },
        ],
      };
    }
  }
);

server.registerTool(
  "get-frequently-asked-questions",
  {
    title: "Get frequently asked questions",
    description:
      "Provides frequently asked questions about branches, tickets, types of people, etc.",
  },
  async () => {
    try {
      const faq: FAQ[] = await getfrequentlyAskedQuestions();

      return {
        content: [{ type: "text", text: JSON.stringify(faq) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              error instanceof Error ? error.message : "unknow error"
            ),
          },
        ],
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
