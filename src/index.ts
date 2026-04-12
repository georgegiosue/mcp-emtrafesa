#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { EmtrafesaHttpRepository } from "./infrastructure/http/emtrafesa-http.repository";
import { startServer } from "./infrastructure/mcp/server";
import { loadPackageJson } from "./shared/utils";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const pkg = loadPackageJson(__dirname);
const repository = new EmtrafesaHttpRepository();

startServer(pkg, repository).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
