import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validation";

// NOTE: this creates a reset token and logs the reset link to the server
// console. Wiring up a real email/SMS provider is a configuration step
// left for after this phase — see README.md.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const { email } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });

  // Always return success, whether or not the account exists, so this
  // endpoint can't be used to discover which emails are registered.
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await db.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    // eslint-disable-next-line no-console
    console.log(`[password reset] ${email} -> ${resetUrl}`);
  }

  return NextResponse.json({
    ok: true,
    message: "If an account exists for that email, a reset link has been sent.",
  });
}
