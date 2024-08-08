import { Lucia } from "lucia";
import { prismaClient } from "#app/db/prismaClient";
import { PrismaAdapter } from "./prismaLuciaAdapter";

export const lucia = new Lucia(new PrismaAdapter(prismaClient), {
  getUserAttributes(attributes) {
    return { name: attributes.name, email: attributes.email };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
