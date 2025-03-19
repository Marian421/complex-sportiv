const express = require('express');
const router = express.Router();
const pool = require('../db');
const hash = require('../utils/hash')


router.get("/login", (req, res) => {
    res.json({message: "login path works"});
})

router.get("/register", (req, res) => {
    res.json({message: "register path works"})
})

router.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
            [name, email, password]
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

        if (user.rowCount !== 0){
            if (password === user.rows[0].password){
                res.json({message: "logged in succesfully"})
            }
        }

        res.json({message: "email not found"});
    } catch (err) {
        console.error(err.message);
    }
})


module.exports = router;