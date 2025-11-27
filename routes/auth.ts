import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { redirectIfAuthCookie, authUserCookie } from "../middlewares/auth.js"

const router = Router();

router.get("/register", redirectIfAuthCookie, (req, res) => res.render("login", { page: "register" }))
router.post("/register", redirectIfAuthCookie, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const q = "INSERT INTO users (email, password_hash) VALUES (?, ?);";
    const [result] = await db.execute(q, [email, passwordHash]);

    res.status(201).json({ userId: (result as any).insertId });
  } catch (err: any) {
    res.status(400).json({ error: "Email already exists" });
  }
});

router.get("/login", redirectIfAuthCookie, (req, res) => res.render("login", { page: "login" }))
router.post("/login/:cookie", redirectIfAuthCookie, async (req, res) => {
  const { cookie } = req.params
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const q = "SELECT * FROM users WHERE email = ?;";
  const [rows] = await db.execute(q, [email]);
  const users = rows as any[];

  if (!users.length) return res.status(401).json({ error: "Invalid credentials" });

  const user = users[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  if (cookie) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1h
    });

    res.json({ ok: true });
  } else {
    res.json({ token });
  }

});

router.get("/logout", authUserCookie, (req, res) => {
  res.clearCookie("token");
  res.redirect('/')
});

export default router;
