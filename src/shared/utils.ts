import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PackageJson } from "../domain/models/package.model";

export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}

function findPackageJsonPath(dir: string): string {
  const candidate = join(dir, "package.json");
  try {
    readFileSync(candidate);
    return candidate;
  } catch {
    const parent = join(dir, "..");
    if (parent === dir) throw new Error("package.json not found");
    return findPackageJsonPath(parent);
  }
}

export function loadPackageJson(dir: string): PackageJson {
  const path = findPackageJsonPath(dir);
  return JSON.parse(readFileSync(path, "utf-8"));
}
