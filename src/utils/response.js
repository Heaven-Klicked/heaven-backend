function errorResponse(res, { code, message }) {
  return res.status(400).send({
    status: code,
    success: false,
    message,
  });
}

module.exports = { errorResponse };
