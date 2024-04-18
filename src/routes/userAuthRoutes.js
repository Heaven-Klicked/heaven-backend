const express = require("express");
const router = express.Router();
const userAuthController = require("../controllers/userAuthControllers");

// Define routes
router.post("/login", userAuthController.sendUserLoginOTP);
router.post("/login/verify", userAuthController.verifyUserLoginOTP);
router.get("/", (req, res) => {
  res.send("Hello, this is the  ");
});

module.exports = router;
