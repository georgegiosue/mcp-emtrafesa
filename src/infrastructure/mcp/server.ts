import { McpServer } from "@modelcontextprotocol/server";
import {
  type StdioServerHandle,
  serveStdio,
} from "@modelcontextprotocol/server/stdio";
import type { EmtrafesaRepository } from "../../domain/ports/emtrafesa.repository";
import { SERVER_INSTRUCTIONS } from "./instructions";
import { registerTools } from "./tools";

export type PackageJson = { name: string; version: string };

export function createServer(
  pkg: PackageJson,
  repo: EmtrafesaRepository,
): McpServer {
  const server = new McpServer(
    { name: pkg.name, version: pkg.version },
    { instructions: SERVER_INSTRUCTIONS },
  );

  registerTools(server, repo);

  return server;
}

export function startServer(
  pkg: PackageJson,
  repo: EmtrafesaRepository,
): StdioServerHandle {
  const handle = serveStdio(() => createServer(pkg, repo), {
    onerror: (error) => console.error(`[${pkg.name}] transport error:`, error),
  });

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => void handle.close());
  }

  console.error(`${pkg.name} v${pkg.version} listening on stdio`);

  return handle;
}
