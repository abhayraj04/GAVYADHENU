import crypto from "node:crypto";

/**
 * Enterprise-grade cryptographic password hashing using scrypt with random salt.
 * Timing-safe comparisons protect against side-channel and timing attacks.
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!storedHash || !storedHash.includes(":")) return resolve(false);
    const [salt, key] = storedHash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const keyBuffer = Buffer.from(key, "hex");
        const match = crypto.timingSafeEqual(keyBuffer, derivedKey);
        resolve(match);
      } catch {
        resolve(false);
      }
    });
  });
}

/**
 * Generate a cryptographically secure 32-byte hex token with a 24-hour expiration.
 */
export function generateVerificationToken(hours = 24): { token: string; expires: Date } {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000);
  return { token, expires };
}

/**
 * Generate a 6-digit or 32-byte secure reset token with a 1-hour expiration.
 */
export function generateResetToken(hours = 1): { token: string; expires: Date } {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000);
  return { token, expires };
}
