import { randomBytes } from 'crypto'

export function generateToken(length: number = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(length);
  let token = "";

  for (let i = 0; i < 10; i++) {
    token += chars[bytes[i] % chars.length];
  }

  return token;
}