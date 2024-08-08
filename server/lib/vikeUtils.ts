import type { renderPage } from "vike/server";
export function renderPageToResponse(
  pageContext: Awaited<ReturnType<typeof renderPage>>,
): Response {
  const response = pageContext.httpResponse;

  const { readable, writable } = new TransformStream();

  response?.pipe(writable);

  return new Response(readable, {
    status: response?.statusCode,
    headers: response?.headers,
  });
}
