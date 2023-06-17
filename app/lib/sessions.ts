import type { Session } from "@remix-run/cloudflare";
import { createCookieSessionStorage } from "@remix-run/cloudflare";

const session = createCookieSessionStorage({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "__s_session",

    // all of these are optional
    // domain: "",
    // secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    sameSite: "lax",
    secrets: ["nCLNyIlnRRKDnumdclDkvJAtWhNpyTHEXaftAgEv"],
  },
});

const { commitSession, destroySession } = session;
export { commitSession, destroySession };

export const getSession = (request: Request) =>
  session.getSession(request.headers.get("Cookie"));

export async function setSessionUser(
  sessionFromRequest: Session,
  userId: string
) {
  await sessionFromRequest.set("id", userId);
  return session.commitSession(sessionFromRequest);
}
