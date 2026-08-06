#!/usr/bin/env node
import { name, version } from "../package.json";
import { EmtrafesaHttpRepository } from "./infrastructure/http/emtrafesa-http.repository";
import { startServer } from "./infrastructure/mcp/server";

try {
  startServer({ name, version }, new EmtrafesaHttpRepository());
} catch (error) {
  console.error("Fatal error:", error);
  process.exit(1);
}
