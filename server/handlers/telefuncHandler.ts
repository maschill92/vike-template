import type { Handler } from "hono";
import type { HonoContext } from "../lib/honoContext";
import { telefunc } from "telefunc";

export const telefuncHandler: Handler<HonoContext> = async (c) => {
  const user = c.get("user");
  console.log("in telefunc handler. user is: ", user);
  const httpResponse = await telefunc({
    url: c.req.url,
    method: c.req.method,
    body: await c.req.text(),
    context: {
      user: c.get("user"),
    },
  });
  const { body, statusCode, contentType } = httpResponse;
  return new Response(body, {
    status: statusCode,
    headers: {
      "Content-Type": contentType,
    },
  });
};
