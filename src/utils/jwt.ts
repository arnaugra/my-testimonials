import jwt from "jsonwebtoken";

export function generateToken(userId: number): string {
    const payload = { id: userId };
    const secret = process.env.JWT_SECRET!;

    return jwt.sign(payload, secret, { expiresIn: "1h" });
}

export function verifyToken(token: string): { id: number } {
    const secret = process.env.JWT_SECRET!;
    try {
        const payload = jwt.verify(token, secret);
        return payload as { id: number };
    } catch (err) {
        throw new Error("Token inválido");
    }
}
