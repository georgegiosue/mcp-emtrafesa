import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { EmtrafesaRepository } from "../../../domain/ports/emtrafesa.repository";

type Handler<TParams> = (
  params: TParams,
  repository: EmtrafesaRepository,
) => Promise<CallToolResult>;

export interface Tool<TParams = Record<string, never>, TConfig = object> {
  name: string;
  config: TConfig;
  handler: Handler<TParams>;
}

export function register(
  server: McpServer,
  repository: EmtrafesaRepository,
  tool: Tool<unknown>,
) {
  server.registerTool(tool.name, tool.config, (params) =>
    tool.handler(params, repository),
  );
}
