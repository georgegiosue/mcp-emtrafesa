#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { EmtrafesaHttpRepository } from "./infrastructure/http/emtrafesa-http.repository";
import { registerTools } from "./infrastructure/mcp/tools";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

const server = new McpServer({
  name: packageJson.name,
  version: packageJson.version,
});

const repository = new EmtrafesaHttpRepository();
registerTools(server, repository);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Emtrafesa MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
