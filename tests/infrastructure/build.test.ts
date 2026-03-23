import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";

const ROOT = join(import.meta.dir, "../..");
const ENTRY = join(ROOT, "dist/src/index.js");

describe("build artifact", () => {
  test("dist/src/index.js starts without module resolution errors", () => {
    const result = spawnSync("node", [ENTRY], {
      timeout: 3000,
      encoding: "utf-8",
    });

    // node exits with SIGTERM when the MCP server has no stdin — that's fine
    const stderr = result.stderr ?? "";

    expect(stderr).not.toContain("ENOENT");
    expect(stderr).not.toContain("ERR_MODULE_NOT_FOUND");
    expect(stderr).not.toContain("ERR_UNSUPPORTED_DIR_IMPORT");
    expect(stderr).toContain("Emtrafesa MCP Server running on stdio");
  });
});
