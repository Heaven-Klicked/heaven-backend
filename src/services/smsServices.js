const unirest = require("unirest");
const { FAST2SMS_API_KEY } = require("../../config/vars");

async function sendOtp({ to, otp }) {
  try {
    const res = await unirest
      .post("https://www.fast2sms.com/dev/bulkV2")
      .headers({ Authorization: FAST2SMS_API_KEY })
      .send({
        variables_values: otp,
        route: "otp",
        numbers: to.slice(3),
      });
    if (!res.body.return) throw res.body;

    return res.body;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = { sendOtp };
