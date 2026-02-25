import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

const getNameFromEmail = (email = "") => {
  const raw = String(email).split("@")[0] || "User";
  const cleaned = raw.replace(/[._-]+/g, " ").trim();
  if (!cleaned) return "User";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const mapUser = (user, fallback = {}) => {
  const email = user?.email ?? fallback.email ?? "";
  const firstName = user?.first_name ?? fallback.firstName ?? getNameFromEmail(email);
  return {
    user_id: user?.user_id,
    firstName,
    lastName: user?.last_name ?? fallback.lastName ?? "",
    email,
    avatar: user?.avatar ?? fallback.avatar ?? "U",
    color: user?.color ?? fallback.color ?? "#2e8b57",
    orders: user?.orders_count ?? 0,
  };
};

const signToken = (user) =>
  jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, avatar, color } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "email, password, firstName, and lastName are required",
      });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await createUser({
      first_name: firstName,
      last_name: lastName,
      email,
      password_hash,
      avatar,
      color,
    });

    const createdUser = await findUserByEmail(email);
    const token = signToken(createdUser);

    return res.status(201).json({
      token,
      user: mapUser(createdUser, { firstName, lastName, email, avatar, color }),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: mapUser(user, { email: user.email }),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};
