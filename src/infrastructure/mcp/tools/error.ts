export function errorResponse(error: unknown) {
  return {
    isError: true as const,
    content: [
      {
        type: "text" as const,
        text: error instanceof Error ? error.message : "unknown error",
      },
    ],
  };
}
