import { Context, Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { generateState, OAuth2RequestError } from "arctic";
import { github } from "../lib/auth/github";
import { prismaClient } from "#app/db/prismaClient";
import { lucia } from "../lib/auth/lucia";
import { generateId } from "lucia";
import { User } from "@prisma/client";
import { HonoContext } from "../lib/honoContext";

export const authRouter = new Hono<HonoContext>()
  .post("/logout", async (c) => {
    const session = c.get("session");
    if (!session) return c.redirect("/");

    await lucia.invalidateSession(session.id);
    const blankSessionCookie = lucia.createBlankSessionCookie();
    setCookie(c, blankSessionCookie.name, blankSessionCookie.value);
    return c.redirect("/");
  })
  .get("/login/github", async (c) => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
    });
    setCookie(c, "github_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "Lax",
    });
    return c.redirect(url.toString());
  })

  .get("/login/github/callback", async (c) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const storedState = getCookie(c, "github_oauth_state") ?? null;
    if (!code || !state || state !== storedState) {
      return c.body(null, 400);
    }
    try {
      const tokens = await github.validateAuthorizationCode(code);
      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const githubUser: GitHubUser = await githubUserResponse.json();
      const existingUser = await prismaClient.user.findUnique({
        where: { githubId: githubUser.id.toString() },
      });
      if (existingUser) {
        await createSessionAndSetCookie(c, existingUser);
        return c.redirect("/");
      }

      const userId = generateId(15);
      const newUser = await prismaClient.user.create({
        data: {
          id: userId,
          githubId: githubUser.id.toString(),
          name: githubUser.name ?? githubUser.login,
          email: githubUser.email,
          avatarUrl: githubUser.avatar_url,
        },
      });
      await createSessionAndSetCookie(c, newUser);
      return c.redirect("/");
    } catch (e) {
      console.error(e);
      if (e instanceof OAuth2RequestError) {
        return c.body(null, 400);
      }
      return c.body(null, 500);
    }
  });
async function createSessionAndSetCookie(c: Context, user: User) {
  const session = await lucia.createSession(user.id, {});
  const { name, value } = lucia.createSessionCookie(session.id);
  setCookie(c, name, value);
}
interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  notification_email?: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan?: {
    collaborators: number;
    name: string;
    space: number;
    private_repos: number;
    [k: string]: unknown;
  };
  suspended_at?: string | null;
  business_plus?: boolean;
  ldap_dn?: string;
  [k: string]: unknown;
}
