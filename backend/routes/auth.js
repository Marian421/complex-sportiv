const express = require('express');
const router = express.Router();
const pool = require('../db');
const hash = require('../utils/hash');
const jwt = require('jsonwebtoken');
const generateResetCode = require('../utils/generateResetCode');
const sendResetEmail = require('../emails/sendResetEmail');
const authenticateToken = require('../middleware/authenticateToken');

router.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM users where email=$1",
            [email]
        )

        if (user.rowCount !== 0){
            return res.status(409).json({message: "user already registered"}); // 409 - conflict
        }

        const hashedPassword = hash.encrypt(password);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
            [name, email, hashedPassword]
        )

        const { password: _, ...userWithoutPassword } = newUser.rows[0];

        res.json(userWithoutPassword);
    } catch (err) {
        console.error(err.message);
    }
})

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query(
            "SELECT * from users WHERE email=$1",
            [email]
        );

        if (user.rowCount === 0){
            return res.status(401).json({message: "Email not found"});
        }
        
        const token = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        if (hash.compare(password, user.rows[0].password)){
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 2 * 60 * 60 * 1000
            });
            return res.json({message: "logged in succesfully"})
        }


        res.status(401).json({message: 'Invalid password'});


    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
})

router.post("/reset", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await pool.query(
            "SELECT id from users where email=$1",
            [email]
        )

        if (user.rowCount === 0) {
            return res.status(404).json({ message: "There is no account with this email" });
        }

        const existingResetCode = await pool.query(
            "SELECT * FROM reset_password WHERE user_id=$1 AND used=false AND expires_at > NOW()",
            [user.rows[0].id]
        );

        if (existingResetCode.rowCount > 0) {
            await pool.query(
                "UPDATE reset_password SET used=true WHERE user_id=$1 AND used=false",
                [user.rows[0].id]
            );
        }

        const code = generateResetCode();
        const resetLink = `http://localhost:5173/reset/new-password?code=${code}`;
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);

        const newResetCode = await pool.query(
            "INSERT INTO reset_password (user_id, code, expires_at) VALUES ($1,$2,$3) RETURNING *",
            [user.rows[0].id, code, expires_at]
        )

        const emailSent = await sendResetEmail(email, resetLink);

        if (!emailSent) {
            await pool.query(
                "DELETE FROM reset_password WHERE id=$1",
                [newResetCode.rows[0].id]
            )
            return res.status(500).json({ message: "Failed to send reset email. Try again later." });
        }

        res.json({message: "Email sent successfully"});
    } catch (err){
        console.error(err.message);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
    
})

router.post('/verify-reset-code', async (req, res) => {
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
            sameSite: "lax",
            maxAge: 60 * 60 * 1000, 
        });
    
        res.json({ 
            message: "Code is valid, proceed with password reset."
         });
    
      } catch (err) {
        console.error("Error during code verification:", err.message);
        res.status(500).json({ message: "Server error during code verification" });
      }
})

router.post("/reset-password", authenticateToken, async(req,res) => {
  try {
        const { newPassword } = req.body;
        const { userId } = req.user;

        const hashedPassword = hash.encrypt(newPassword);

        const result = await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
            [hashedPassword, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        await pool.query("UPDATE reset_password SET used = true WHERE user_id = $1", [userId]);

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
        });

        res.json({ message: "Password successfully updated!" });
    } catch (err) {
        console.error("Error during password reset:", err.message);
        res.status(500).json({ message: "Server error during password reset" });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id=$1",
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
});

router.post('/logout', (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({ message: "Logged out successfully" });
});

router.delete("/delete-account", authenticateToken, async (req, res) => {
    try {
      const { userId } = req.user;
  
      const result = await pool.query(
        "DELETE FROM users WHERE id = $1",
        [userId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Failed to delete account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
});

module.exports = router;