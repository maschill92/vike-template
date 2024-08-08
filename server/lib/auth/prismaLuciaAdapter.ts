import type { Adapter, DatabaseSession, DatabaseUser, UserId } from "lucia";
import type { prismaClient as _prismaClient } from "#app/db/prismaClient";
import { Session, User } from "@prisma/client";
type PrismaClient = typeof _prismaClient;

export class PrismaAdapter implements Adapter {
  constructor(private readonly prismaClient: PrismaClient) {}

  async getSessionAndUser(
    sessionId: string,
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const result = await this.prismaClient.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (!result) return [null, null];
    const user = result.user;
    delete result["user" as keyof typeof result];
    return [
      transformIntoDatabaseSession(result),
      transformIntoDatabaseUser(user),
    ];
  }

  async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
    const result = await this.prismaClient.session.findMany({
      where: { userId },
    });
    return result.map(transformIntoDatabaseSession);
  }

  async setSession(session: DatabaseSession): Promise<void> {
    await this.prismaClient.session.create({
      data: {
        id: session.id,
        expiresAt: session.expiresAt,
        userId: session.userId,
        ...session.attributes,
      },
    });
  }

  async updateSessionExpiration(
    sessionId: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prismaClient.session.update({
      where: { id: sessionId },
      data: { expiresAt },
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.prismaClient.session.delete({ where: { id: sessionId } });
  }

  async deleteUserSessions(userId: UserId): Promise<void> {
    await this.prismaClient.session.deleteMany({ where: { userId: userId } });
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.prismaClient.session.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
  }
}

function transformIntoDatabaseSession(session: Session): DatabaseSession {
  const { id, userId, expiresAt, ...attributes } = session;
  return {
    id,
    userId,
    expiresAt,
    attributes,
  };
}

function transformIntoDatabaseUser(user: User): DatabaseUser {
  const { id, name, email } = user;
  return {
    id,
    attributes: {
      name,
      email,
    },
  };
}

declare module "lucia" {
  interface Register {
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
interface DatabaseUserAttributes {
  name: string;
  email: string;
}
