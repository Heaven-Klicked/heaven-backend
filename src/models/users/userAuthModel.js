const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserAuthSchema = new Schema({
  // Basic user authentication details
  country: {
    type: String,
    required: true,
  },
  phone_no: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Additional fields for dating app
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  interests: [
    {
      type: String,
    },
  ],
  expire_password: {
    type: Date,
    required: true,
  },
  date_time: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
  is_user_block: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: Number,
    required: true,
    default: 1,
  },
});

// Hash the password before saving
UserAuthSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// Hash the password before updating
UserAuthSchema.pre("findOneAndUpdate", async function (next) {
  const userToUpdate = await this.model.findOne(this.getQuery());

  if (
    !this._update.password ||
    userToUpdate.password === this._update.password
  ) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this._update.password = await bcrypt.hash(this._update.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

const UserAuthModel = mongoose.model("UserAuth", UserAuthSchema);

module.exports = UserAuthModel;
