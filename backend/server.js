const express = require("express");
const cors = require("cors");
//require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/register", (req, res) => {
  res.json("works")
})

app.get("/login", (req, res) => {
  res.json("all good");
})

app.get("/terenuri", (req, res) => {
  res.json([
    { id: 1, nume: "Teren Fotbal", sport: "Fotbal", capacitate: 10 },
    { id: 2, nume: "Teren Tenis", sport: "Tenis", capacitate: 2 },
  ]);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));