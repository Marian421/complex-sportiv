const express = require("express");
const cors = require("cors");
const pool = require("./db.js")
const app = express();
const path = require('path');

const auth = require('./routes/auth.js');
const fields = require('./routes/fields.js');
//const authenticateToken = require("./utils/authenticateToken.js");

app.use(cors());
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




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));