import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  // Deliberately vague on failure — never reveal whether the email exists.
  const genericError = { error: "Incorrect email or password" };

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json(genericError, { status: 401 });

  if (!user.isActive) {
    return NextResponse.json(
      { error: "This account has been deactivated. Contact support." },
      { status: 403 }
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return NextResponse.json(genericError, { status: 401 });

  const token = await signSession({ userId: user.id, role: user.role, email: user.email });

  const res = NextResponse.json({
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
