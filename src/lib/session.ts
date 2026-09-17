import "server-only";
import { cookies } from "next/headers";
import { verifySession, type SessionPayload } from "@/lib/auth";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "sc_session";

// Reads and validates the session cookie for the current request.
// Returns null when there is no session or it is invalid/expired —
// callers decide whether that means "redirect to login" or "render as guest".
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

// Convenience helper for pages/API routes that need the full user record
// (not just the JWT claims) — e.g. to check isActive or load profile data.
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { customerProfile: true, artisanProfile: true },
  });

  if (!user || !user.isActive) return null;
  return user;
}
