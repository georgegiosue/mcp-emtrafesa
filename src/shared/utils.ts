import { readFileSync } from "node:fs";
import { join } from "node:path";

export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}

export function findPackageJson(dir: string): string {
  const candidate = join(dir, "package.json");
  try {
    readFileSync(candidate);
    return candidate;
  } catch {
    const parent = join(dir, "..");
    if (parent === dir) throw new Error("package.json not found");
    return findPackageJson(parent);
  }
}
