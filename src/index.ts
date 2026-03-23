#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { EmtrafesaHttpRepository } from "./infrastructure/http/emtrafesa-http.repository";
import { registerTools } from "./infrastructure/mcp/tools";
import { findPackageJson } from "./shared/utils";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const packageJson = JSON.parse(readFileSync(findPackageJson(__dirname), "utf-8"));

const server = new McpServer({
  name: packageJson.name,
  version: packageJson.version,
});

const repository = new EmtrafesaHttpRepository();

async function main() {
  await registerTools(server, repository);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  const toolCount = Object.keys((server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools).length;
  console.error(`[${packageJson.name as string}] v${packageJson.version as string} running`);
  console.error(`  transport : stdio`);
  console.error(`  tools     : ${toolCount}`);
  console.error(`  node      : ${process.version}`);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
