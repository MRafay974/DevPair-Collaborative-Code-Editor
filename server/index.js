const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/session");
const { handleSocket } = require("./sockets/socket");
const executeRoutes = require("./routes/execute");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "https://devpair.vercel.app",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/execute", executeRoutes);


io.on("connection", socket => handleSocket(socket, io));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
