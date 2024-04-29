const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserProfileModel = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  interests: { type: [String], default: [] },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  profilePicURL: { type: String, default: "default.jpg" },
  specificFeaturePhoto: { type: String },
  userBio: { type: String, default: "" },
  last_online: { type: Date, default: Date.now },
  is_verified: { type: Boolean, default: false },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
});

UserProfileSchema = mongoose.model("user_profile_tracking", UserProfileModel);
module.exports = UserProfileSchema;
