const express = require("express");
let connectDB = require("../database/db");
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userAuthRoutes = require("./routes/userAuthRoutes");
const userRoutes = require("./routes/userRoutes");
app.use("/api/users/auth", userAuthRoutes);
app.use("/api/users", userRoutes);

module.exports = app; // Export the app instance
