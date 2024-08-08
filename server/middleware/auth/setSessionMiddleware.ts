import { MiddlewareHandler } from "hono";
import { lucia } from "../../lib/auth/lucia";
import { HonoContext } from "../../lib/honoContext";
import { setCookie } from "hono/cookie";

export const setSessionMiddleware: MiddlewareHandler<HonoContext> = async (
  c,
  next,
) => {
  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const { name, value } = lucia.createSessionCookie(session.id);
    setCookie(c, name, value);
  } else {
    const { name, value } = lucia.createBlankSessionCookie();
    setCookie(c, name, value);
  }
  c.set("user", user);
  c.set("session", session);
  return next();
};
