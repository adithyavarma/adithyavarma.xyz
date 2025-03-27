const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const songs = [
  { id: 1, title: "Song One", artist: "Artist One" },
  { id: 2, title: "Song Two", artist: "Artist Two" },
  { id: 3, title: "Song Three", artist: "Artist Three" },
];

app.get("/", (req, res) => {
  res.send("Welcome to the Music API!");
});

app.get("/songs", (req, res) => {
  res.json(songs);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
