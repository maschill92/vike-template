import { Hono } from "hono";
import { HonoContext } from "./lib/honoContext";
// import { requestOriginMiddleware } from "./middleware/auth/requestOriginMiddleware";
import { setSessionMiddleware } from "./middleware/auth/setSessionMiddleware";
import { vikeHandler } from "./handlers/vikeHandler";
import { authRouter } from "./router/authRouter";
import { telefuncHandler } from "./handlers/telefuncHandler";

const app = new Hono<HonoContext>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app
  // .use(requestOriginMiddleware)
  .use(setSessionMiddleware)
  .route("/_auth", authRouter)
  .all("/_telefunc", telefuncHandler)
  .all("*", vikeHandler);

export default app;
export type AppType = typeof route;
