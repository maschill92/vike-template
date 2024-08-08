import type { Env } from "hono";
import type { User } from "lucia";

export interface HonoContext extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
  };
}
