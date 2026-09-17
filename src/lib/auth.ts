import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

// ── Password hashing ────────────────────────────────────────────────────
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// ── Session tokens (JWT, stored in an httpOnly cookie) ──────────────────
export type SessionPayload = {
  userId: string;
  role: "CUSTOMER" | "ARTISAN" | "ADMIN";
  email: string;
};

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Add it to your .env file — see .env.example."
    );
  }
  return new TextEncoder().encode(secret);
}

const SESSION_TTL = "7d";

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null; // expired, tampered, or malformed
  }
}
