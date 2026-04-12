import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { PackageJson } from "../../domain/models/package.model";
import type { EmtrafesaRepository } from "../../domain/ports/emtrafesa.repository";
import { registerTools } from "./tools";

interface McpServerInternals {
  _registeredTools: Record<string, unknown>;
}

function getToolCount(server: McpServer): number {
  const s = server as unknown as McpServerInternals;
  return Object.keys(s._registeredTools).length;
}

function logStartup(pkg: PackageJson, tools: number): void {
  console.error(`[${pkg.name}] v${pkg.version} running`);
  console.error(`  transport : stdio`);
  console.error(`  tools     : ${tools}`);
  console.error(`  node      : ${process.version}`);
}

export async function startServer(
  pkg: PackageJson,
  repo: EmtrafesaRepository,
): Promise<void> {
  const server = new McpServer({
    name: pkg.name,
    version: pkg.version,
  });

  await registerTools(server, repo);
  await server.connect(new StdioServerTransport());

  logStartup(pkg, getToolCount(server));
}
