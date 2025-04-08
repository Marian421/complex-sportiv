const express = require('express');
const router = express.Router();
const pool = require('../db');
const hash = require('../utils/hash');
const jwt = require('jsonwebtoken');
const generateResetCode = require('../utils/generateResetCode');
const sendResetEmail = require('../utils/sendResetEmail');

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

        const code = generateResetCode();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);

        const newResetCode = await pool.query(
            "INSERT INTO reset_password (user_id, code, expires_at) VALUES ($1,$2,$3) RETURNING *",
            [user.rows[0].id, code, expires_at]
        )

        const emailSent = await sendResetEmail(email, code);

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


module.exports = router;