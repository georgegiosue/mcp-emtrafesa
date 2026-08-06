import { api } from "../../config/api";

export async function request(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const response = await fetch(`${api.baseUrl}${path}`, {
    ...init,
    headers: { ...api.headers, ...init.headers },
    signal: AbortSignal.timeout(api.timeoutMs),
  }).catch((error: unknown) => {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error(`Emtrafesa did not respond within ${api.timeoutMs}ms`);
    }

    throw new Error(`Could not reach Emtrafesa at ${path}`, { cause: error });
  });

  if (!response.ok) {
    throw new Error(
      `Emtrafesa returned ${response.status} ${response.statusText} for ${path}`,
    );
  }

  return response;
}
