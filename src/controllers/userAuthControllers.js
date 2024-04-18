const Joi = require("joi");
const User = require("../models/users/userModel");
const { USER_TYPES } = require("../utils/projectTypes");
const { sendOtp } = require("../services/smsServices");
const { uniqueId, generateOtp } = require("../utils/helper");
const otpVerificationModel = require("../models/otpVerificationModel");
const { errorResponse } = require("../utils/response");
const { createOtpToken, createAuthToken } = require("../utils/auth");

const DUMMY_PHONE_NUMBER = process.env.DUMMY_PHONE_NUMBER;
const DUMMY_OTP = process.env.DUMMY_OTP;
const OTP_EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes (adjust as per your requirement)

exports.sendUserLoginOTP = async (req, res) => {
  try {
    const { value, error } = Joi.object({ phone: Joi.string().required() })
      .required()
      .validate(req.body);

    let user;
    if (value.phone === DUMMY_PHONE_NUMBER) {
      // user = await User.findById(DUMMY_USER_ID);
      console.log("DUMMY USER : ", user);
    } else {
      user = await User.findOne({ phone: value.phone });
    }

    if (!user) {
      // TODO : DO SOMETHING LATER
    }

    // 1. CREATE A SESSION
    const session = uniqueId();

    console.log(`THIS IS SESSION : ${session}`);
    // 2. GENERATE OTP
    const otp = value.phone === DUMMY_PHONE_NUMBER ? DUMMY_OTP : generateOtp();

    await otpVerificationModel.create({
      user: user ? user._id : null,
      userType: USER_TYPES.USER,
      phone: value.phone,
      session,
      otp,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_DURATION),
    });

    if (value.phone !== DUMMY_PHONE_NUMBER) {
      console.log(`OTP : ${otp}`);
      console.log(`SESSION : ${session}`);
      sendOtp({ to: value.phone, otp });
    }

    res.status(200).send({
      message: "OTP sent to your phone number",
      success: true,
      session,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
};

exports.verifyUserLoginOTP = async (req, res) => {
  try {
    const { value, error } = Joi.object({
      session: Joi.string().required(),
      otp: Joi.string().required(),
    }).validate(req.body);

    if (error) {
      return errorResponse(res, { code: 400, message: error.message });
    }

    const otpVerification = await otpVerificationModel
      .findOne({ session: value.session })
      .lean();

    if (!otpVerification) {
      return errorResponse(res, { code: 400, message: "Invalid session" });
    }

    if (otpVerification.expiresAt <= Date.now()) {
      await otpVerificationModel.deleteOne({ _id: otpVerification._id });
      return errorResponse(res, { code: 400, message: "OTP expired!" });
    }

    if (value.otp === otpVerification.otp) {
      await otpVerificationModel.deleteOne({ _id: otpVerification._id });

      let responseData;

      const user = await User.findOne({ _id: otpVerification.user }).lean();
      if (!user) {
        const token = createOtpToken({ phone: otpVerification.phone });
        return res.status(200).send({
          message: "OTP verified successfully",
          success: true,
          newUser: true,
          registrationToken: token,
        });
      }

      const token = createAuthToken({
        id: user._id.toString(),
        userType: USER_TYPES.USER,
      });

      responseData = {
        message: "OTP verified successfully",
        success: true,
        newUser: false,
        authToken: token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePicUrl: user.profilePicURL,
          phone: user.phone,
          isVerified: user.isVerified,
        },
      };

      res.status(200).json(responseData);
    } else {
      res.status(200).send({ message: "Incorrect OTP", success: false });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
};
