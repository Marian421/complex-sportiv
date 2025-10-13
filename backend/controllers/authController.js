const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateResetCode = require('../utils/generateResetCode');
const sendResetEmail = require('../emails/sendResetEmail');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rowCount !== 0) {
      return res.status(409).json({ message: "user already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    const { password: _, ...userWithoutPassword } = newUser.rows[0];
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rowCount === 0) {
      return res.status(401).json({ message: "Email not found" });
    }

    const isValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isValid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user.rows[0].id, role: user.rows[0].role, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure:true,
      sameSite: "None",
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.json({ message: "logged in successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.reset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (user.rowCount === 0) {
      return res.status(404).json({ message: "There is no account with this email" });
    }

    const userId = user.rows[0].id;

    await pool.query(
      "UPDATE reset_password SET used = true WHERE user_id = $1 AND used = false AND expires_at > NOW()",
      [userId]
    );

    const code = generateResetCode();
    const resetLink = `https://complex-sportiv.vercel.app/reset/new-password?code=${code}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const inserted = await pool.query(
      "INSERT INTO reset_password (user_id, code, expires_at) VALUES ($1, $2, $3) RETURNING id",
      [userId, code, expiresAt]
    );

    const emailSent = await sendResetEmail(email, resetLink);
    if (!emailSent) {
      await pool.query("DELETE FROM reset_password WHERE id = $1", [inserted.rows[0].id]);
      return res.status(500).json({ message: "Failed to send reset email. Try again later." });
    }

    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.verifyResetCode = async (req, res) => {
  try {
    const { code } = req.body;

    const result = await pool.query(
      "SELECT * FROM reset_password WHERE code = $1 AND used = false AND expires_at > NOW()",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Invalid or expired reset code." });
    }

    const userId = result.rows[0].user_id;
    const resetToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie("token", resetToken, {
      httpOnly: true,
      secure:true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Code is valid, proceed with password reset." });
  } catch (err) {
    console.error("Error during code verification:", err.message);
    res.status(500).json({ message: "Server error during code verification" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { userId } = req.user;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING id",
      [hashedPassword, userId]
    );

    if (updated.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await pool.query("UPDATE reset_password SET used = true WHERE user_id = $1", [userId]);

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({ message: "Password successfully updated!" });
  } catch (err) {
    console.error("Error during password reset:", err.message);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ message: "Server error fetching user info" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure:true,
    sameSite: "None",
  });

  res.json({ message: "Logged out successfully" });
};

exports.deleteAccount = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Failed to delete account:", err.message);
    res.status(500).json({ message: "Failed to delete account" });
  }
};
