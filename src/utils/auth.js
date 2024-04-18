const jwt = require("jsonwebtoken");

function createOtpToken({ phone }, expiresIn = 600) {
  const token = jwt.sign({ phone }, process.env.JWT_SECRET_KEY, { expiresIn });

  return token;
}

function createAuthToken({ id, userType }, expiresIn = "10d") {
  const token = jwt.sign({ id, userType }, process.env.JWT_SECRET_KEY, {
    expiresIn,
  });

  return token;
}

function verifyOtpToken(token) {
  const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

  return user;
}

module.exports = { createOtpToken, createAuthToken, verifyOtpToken };
