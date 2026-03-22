import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EmtrafesaRepository } from "../../../domain/ports/emtrafesa.repository";
import { register, type Tool } from "./tool";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const skip = new Set([
  "index.ts",
  "index.js",
  "tool.ts",
  "tool.js",
  "error.ts",
  "error.js",
]);

async function scanDir(dir: string, tools: Tool<unknown>[]): Promise<void> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      await scanDir(join(dir, entry.name), tools);
    } else if (!skip.has(entry.name)) {
      const mod = await import(join(dir, entry.name));
      if (mod.tool) tools.push(mod.tool);
    }
  }
}

async function loadTools(): Promise<Tool<unknown>[]> {
  const tools: Tool<unknown>[] = [];
  await scanDir(__dirname, tools);
  return tools;
}

export async function registerTools(
  server: McpServer,
  repository: EmtrafesaRepository,
) {
  const tools = await loadTools();
  for (const tool of tools) {
    register(server, repository, tool);
  }
}
