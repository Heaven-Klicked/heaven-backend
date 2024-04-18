const mongoose = require("mongoose");
const { USER_TYPES } = require("../utils/projectTypes");

const Schema = mongoose.Schema;

const OTPVerificationSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    // admin: { type: mongoose.Types.ObjectId, ref: "AdminModel" },
    userType: {
      type: String,
      enum: [...Object.values(USER_TYPES)],
      required: true,
    },
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    session: { type: String, required: true },
    expiresAt: { type: Date, default: () => Date.now() + 10 * 60 * 1000 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OTP_Verification", OTPVerificationSchema);
