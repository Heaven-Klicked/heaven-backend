var jwt = require("jsonwebtoken");
const customerAuth = require("../src/models/users/userAuthModel");

async function verifyUser(req, res, next) {
  try {
    const token = req.header("auth-token");
    if (!token) {
      return res.status(404).json({ status: 401, message: "token not found" });
    } else {
      jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
        async function (err, verifiedUser) {
          if (err) {
            return res
              .status(401)
              .json({ status: 401, message: "Token is expire" });
          } else {
            if (verifiedUser.user_details._id) {
              // console.log(verifiedUser.user_details._id);
              const user_details = await customerAuth.exists({
                _id: verifiedUser.user_details._id,
              });

              if (user_details) {
                req.customer_user = verifiedUser.user_details;

                next();
              } else {
                return res
                  .status(401)
                  .json({ status: 401, message: "Unauthorized" });
              }
            } else {
              return res
                .status(401)
                .json({ status: 401, message: "Unauthorized Token" });
            }
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
}
