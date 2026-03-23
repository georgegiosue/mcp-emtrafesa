/**
 * Node.js preload script (--import) that patches globalThis.fetch to return
 * fixture data when MCP_TEST_MOCK=1 is set. This avoids real network calls
 * to emtrafesa.pe during E2E tests.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.MCP_TEST_MOCK === "1") {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const FIXTURES = join(__dirname, "../fixtures");

  const read = (file) => readFileSync(join(FIXTURES, file), "utf-8");

  const mockResponse = (body, contentType = "application/json") => ({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(JSON.parse(body)),
    text: () => Promise.resolve(body),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    headers: { get: (h) => (h === "content-type" ? contentType : null) },
  });

  globalThis.fetch = (url) => {
    const u = url.toString();

    if (u.includes("GetSucursalesDestino")) {
      return Promise.resolve(mockResponse(read("GetSucursalesDestino_001.json")));
    }
    if (u.includes("GetSucursales")) {
      return Promise.resolve(mockResponse(read("GetSucursales.json")));
    }
    if (u.includes("GetPreguntasFrecuentes")) {
      return Promise.resolve(mockResponse(read("GetPreguntasFrecuentes.json")));
    }
    if (u.includes("GetItinerario")) {
      return Promise.resolve(mockResponse(read("GetItinerario_001_003.json")));
    }
    if (u.includes("PostConsulta")) {
      return Promise.resolve(mockResponse(read("PostConsulta.html"), "text/html"));
    }
    if (u.includes("ComprobanteDescarga")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        arrayBuffer: () => Promise.resolve(Buffer.from("%PDF-1.4 fake").buffer),
      });
    }

    return Promise.reject(new Error(`Unexpected fetch in test: ${u}`));
  };
}
