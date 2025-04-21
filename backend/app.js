const express = require("express");
const cors = require("cors");
const pool = require("./db.js")
const path = require('path');
const cookieParser = require('cookie-parser');

const auth = require('./routes/auth.js');
const fields = require('./routes/fields.js');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/auth", auth);
app.use("/fields", fields);

app.post("/register", (req, res) => {
  res.json("works")
})

app.get("/login", (req, res) => {
  res.json("all good");
})

module.exports = app;   
