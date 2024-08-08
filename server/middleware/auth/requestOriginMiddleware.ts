import { MiddlewareHandler } from "hono";
import { HonoContext } from "../../lib/honoContext";
import { verifyRequestOrigin } from "lucia";

export const requestOriginMiddleware: MiddlewareHandler<HonoContext> = async (
  c,
  next,
) => {
  if (c.req.method === "GET") {
    return next();
  }
  const originHeader = c.req.header("Origin") ?? null;
  const hostHeader = c.req.header("Host") ?? null;
  console.log("requestOriginMiddleware", {
    originHeader,
    hostHeader,
  });
  if (
    !originHeader ||
    !hostHeader ||
    verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    console.log("requestOriginMiddleware triggered.");
    return c.body(null, 403);
  }
  return next();
};
