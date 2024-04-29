const express = require("express");
let connectDB = require("../database/db");
const app = express();
const PORT = process.env.PORT || 3000;
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  perMessageDeflate: false,
  cors: {
    origins: "*",
  },
});

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userAuthRoutes = require("./routes/userAuthRoutes");
const userRoutes = require("./routes/userRoutes");

// WEBSOCKETS ROUTES
const getNearestUsers = require("../src/webSockets/getNearestUsers");
app.use("/api/users/auth", userAuthRoutes);
app.use("/api/users", userRoutes);

io.on("connection", (socket) => {
  socket.on("get_nearest_users", (data) => {
    getNearestUsers(socket, data);
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

module.exports = app; // Export the app instance
