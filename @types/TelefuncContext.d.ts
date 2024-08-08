import "telefunc";
import type { User } from "lucia";

declare module "telefunc" {
  namespace Telefunc {
    interface Context {
      user: User | null;
    }
  }
}
