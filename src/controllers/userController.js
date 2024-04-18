const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/users/userModel"); // Assuming your user model is named userModel.js
const { errorResponse } = require("../utils/response");
const { createAuthToken, verifyOtpToken } = require("../utils/auth");

exports.registerUser = async (req, res) => {
  try {
    const { value, error } = Joi.object({
      registrationToken: Joi.string().required(),
      username: Joi.string().required(),
      name: Joi.string().required(),
      phone: Joi.string().required(),
      profilePicURL: Joi.string().required(),
      email: Joi.string().email().required(),
      userBio: Joi.string(),
      specificFeaturePhoto: Joi.string(),
      userPhotos: Joi.array().items(Joi.string()).max(4),
      favorites: Joi.array().items(Joi.object()).default([]),
      isVerified: Joi.boolean().default(false),
      isActive: Joi.boolean().default(true),
      tellThemYourInterest: Joi.array()
        .items(
          Joi.object({
            category: Joi.string().required(),
            subCategories: Joi.array().items(Joi.string()).required(),
          })
        )
        .default([]),
      personalityTraits: Joi.array()
        .items(
          Joi.object({
            category: Joi.string().required(),
            subCategories: Joi.array().items(Joi.string()).required(),
          })
        )
        .default([]),
      sexualOrientation: Joi.string(),
      occupation: Joi.string(),
      gender: Joi.string().valid("Male", "Female", "Other"),
      payments: Joi.array().items(Joi.string()).default([]),
    }).validate(req.body);

    if (error) {
      return errorResponse(res, { code: 401, message: error.message });
    }
    try {
      decodedToken = verifyOtpToken(value.registrationToken);
      value.phone = decodedToken.phone;
    } catch (err) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid Token.", error: err });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: value.username }, { email: value.email }],
    });
    if (existingUser) {
      if (existingUser.phone === value.phone) {
        return res.status(400).send({
          message: `Phone '${value.phone}' is already taken.`,
          success: false,
        });
      }
      if (existingUser.username === value.username) {
        return res.status(400).send({
          message: `Username '${value.username}' is already taken.`,
          success: false,
        });
      }
      if (existingUser.email === value.email) {
        return res.status(400).send({
          message: `Email '${value.email}' is already registered.`,
          success: false,
        });
      }
    }

    // Create the user
    const newUser = await User.create(value);

    // Generate authentication token
    const token = createAuthToken({
      id: newUser._id.toString(),
      userType: "User", // Assuming this is the user type for your authentication
    });

    // Respond with success
    res.status(200).json({
      authToken: token,
      message: "User registered successfully",
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePicURL: newUser.profilePicURL,
        phone: newUser.phone,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error registering user", success: false, error });
  }
};
