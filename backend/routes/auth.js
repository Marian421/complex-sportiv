const express = require('express');
const router = express.Router();
const pool = require('../db');
const hash = require('../utils/hash');
const jwt = require('jsonwebtoken');
const generateResetCode = require('../utils/generateResetCode');
const sendResetEmail = require('../utils/sendResetEmail');
const authenticateToken = require('../utils/authenticateToken');

router.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM users where email=$1",
            [email]
        )

        if (user.rowCount !== 0){
            return res.json({message: "user already registered"});
        }

        const hashedPassword = hash.encrypt(password);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
            [name, email, hashedPassword]
        )
        res.json(newUser.rows[0]);
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
            return res.json({message: "email not found"});
        }
        
        const token = jwt.sign({ userId: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        if (hash.compare(password, user.rows[0].password)){
            return res.json({message: "logged in succesfully", token})
        }


        res.json({message: 'invalid password'});


    } catch (err) {
        console.error(err.message);
    }
})

router.post("/reset", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await pool.query(
            "SELECT id from users where email=$1",
            [email]
        )

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingResetCode = await pool.query(
            "SELECT * FROM reset_password WHERE user_id=$1 AND used=false AND expires_at > NOW()",
            [user.rows[0].id]
        );

        if (existingResetCode.rows.length > 0) {
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
                "DELETE FROM reset_password WHERE id=&1",
                [user.rows[0].id]
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
    
        if (result.rows.length === 0) {
          return res.status(400).json({ message: "Invalid or expired reset code." });
        }

        const userId = result.rows[0].user_id;
        const resetToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        res.json({ 
            message: "Code is valid, proceed with password reset.",
            resetToken
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

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        await pool.query("UPDATE reset_password SET used = true WHERE user_id = $1", [userId]);

        res.json({ message: "Password successfully updated!" });
    } catch (err) {
        console.error("Error during password reset:", err.message);
        res.status(500).json({ message: "Server error during password reset" });
    }
})


module.exports = router;