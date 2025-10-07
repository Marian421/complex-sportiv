const express = require("express");
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');

const auth = require('./routes/auth.js');
const fields = require('./routes/fields.js');
const admin = require('./routes/admin.js');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://complex-sportiv.vercel.app'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/auth", auth);
app.use("/fields", fields);
app.use("/admin", admin)

module.exports = app;   
