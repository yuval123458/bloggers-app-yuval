const httpError = require("../../models/http-error");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("no token were found split succeeded");
    }
    const decodedToken = jwt.verify(token, config.get("JWT_KEY"));
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next(new httpError("no token were found", 401));
  }
};
