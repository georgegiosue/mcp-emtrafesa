import { createMcpHandler } from "@modelcontextprotocol/server";
import { name, version } from "../package.json";
import { EmtrafesaHttpRepository } from "./infrastructure/http/emtrafesa-http.repository";
import { createServer } from "./infrastructure/mcp/server";

const MCP_PATH = "/mcp";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
  "Access-Control-Allow-Headers":
    "content-type, mcp-session-id, mcp-protocol-version",
  "Access-Control-Expose-Headers": "mcp-session-id",
  "Access-Control-Max-Age": "86400",
} as const;

const handler = createMcpHandler(
  () => createServer({ name, version }, new EmtrafesaHttpRepository()),
  {
    legacy: "stateless",
    onerror: (error) => console.error(`[${name}] transport error:`, error),
  },
);

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function json(body: unknown, status = 200): Response {
  return withCors(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    if (pathname === MCP_PATH) {
      return withCors(await handler.fetch(request));
    }

    if (pathname === "/" && request.method === "GET") {
      return json({ name, version, endpoint: MCP_PATH });
    }

    return json({ error: `Not found: ${pathname}` }, 404);
  },
};
