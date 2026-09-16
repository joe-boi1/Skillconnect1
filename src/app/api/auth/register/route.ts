import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signSession } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { fullName, email, phone, password, role } = parsed.data;

  const existing = await db.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email or phone already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  // Create the user and their role-specific profile together, so the two
  // can never end up out of sync.
  const user = await db.user.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash,
      role,
      ...(role === "CUSTOMER"
        ? { customerProfile: { create: {} } }
        : { artisanProfile: { create: {} } }),
    },
  });

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
