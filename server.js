const express = require("express");
const crypto = require("crypto");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const tokens = {};

app.post("/generate-token", (req, res) => {
  const token = crypto.randomUUID();
  const expiry = Date.now() + 15 * 60 * 1000; // 15 min

  tokens[token] = {
    name: req.body.name,
    email: req.body.email,
    expiry,
    type: "valid", // ou 'suspect' / 'blocked'
  };

  res.json({ token });
});

app.get("/access", (req, res) => {
  const token = req.query.token;
  const info = tokens[token];

  if (!info || Date.now() > info.expiry) {
    return res.send("❌ Accès refusé ou token expiré.");
  }

  if (info.type === "suspect") {
    return res.redirect(process.env.ROOM_GHOST);
  } else {
    return res.redirect(process.env.ROOM_REAL);
  }
});

const messages = [];

app.get("/chat.html", (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", (req, res) => {
  const { message } = req.body;
  messages.push(message);
  res.sendStatus(200);
});

const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("✅ Un utilisateur est connecté au chat live");

  socket.on("message", (msg) => {
    io.emit("message", msg); // retransmet à tout le monde
  });

  socket.on("disconnect", () => {
    console.log("❌ Un utilisateur a quitté le chat");
  });
});

http.listen(3000, () => {
  console.log("✅ ONLYZOOM + Chat Live en ligne sur http://localhost:3000");
});