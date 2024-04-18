const crypto = require("crypto");

function uniqueId() {
  return crypto.randomUUID();
}

function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000);

  return otp;
}

module.exports = { uniqueId, generateOtp };
