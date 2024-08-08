import { Handler } from "hono";
import { renderPage } from "vike/server";
import { renderPageToResponse } from "../lib/vikeUtils";
import { HonoContext } from "../lib/honoContext";

export const vikeHandler: Handler<HonoContext> = async (c) => {
  const pageContext = await renderPage({
    urlOriginal: c.req.url,
    headersOriginal: c.req.header(),
    user: c.get("user"),
  });
  return renderPageToResponse(pageContext);
};
