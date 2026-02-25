import { pool } from "../config/database.js";

export const createUser = async ({
  first_name,
  last_name,
  email,
  password_hash,
  avatar,
  color,
}) => {
  // Preferred schema (campusglow)
  try {
    const sql = `
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password_hash,
        avatar,
        color
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      first_name,
      last_name,
      email,
      password_hash,
      avatar ?? "??",
      color ?? "#2e8b57",
    ]);

    return result;
  } catch (error) {
    // Fallback schema (campus_store): only email/password_hash columns guaranteed.
    if (!/unknown column/i.test(error.message)) throw error;

    const [result] = await pool.execute(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, password_hash]
    );

    return result;
  }
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};
