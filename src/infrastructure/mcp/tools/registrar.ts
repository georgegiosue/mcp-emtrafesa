import type { McpServer } from "@modelcontextprotocol/server";
import type { EmtrafesaRepository } from "../../../domain/ports/emtrafesa.repository";

export type ToolRegistrar = (
  server: McpServer,
  repository: EmtrafesaRepository,
) => void;
