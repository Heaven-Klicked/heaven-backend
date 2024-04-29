const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  phone: String,
  profilePicURL: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userBio: { type: String, default: "" },
  specificFeaturePhoto: { type: String },
  userPhotos: [String],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  tellThemYourInterest: [
    {
      category: String,
      subCategories: [String],
    },
  ],
  personalityTraits: [
    {
      category: String,
      subCategories: [String],
    },
  ],
  sexualOrientation: String,
  occupation: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  payments: [String],
  // Other fields as needed
});

const User = mongoose.model("User", userSchema);

module.exports = User;
