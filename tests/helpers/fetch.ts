import { spyOn } from "bun:test";

export function mockFetch(
  body: string | ArrayBuffer,
  status = 200,
): ReturnType<typeof spyOn> {
  return spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(body, {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

export function mockFetchHtml(
  body: string,
  status = 200,
): ReturnType<typeof spyOn> {
  return spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(body, {
      status,
      headers: { "Content-Type": "text/html" },
    }),
  );
}

export function mockFetchBinary(
  body: ArrayBuffer,
  status = 200,
): ReturnType<typeof spyOn> {
  return spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(body, {
      status,
      headers: { "Content-Type": "application/pdf" },
    }),
  );
}

export function mockFetchError(
  status: number,
  statusText: string,
): ReturnType<typeof spyOn> {
  return spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(null, { status, statusText }),
  );
}
