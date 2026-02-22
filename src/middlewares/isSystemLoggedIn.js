const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.isSystemLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({
      message: "Please log in",
    });
  }

  const blacklistedToken = await tokenBlacklistModel.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: decode.userId });

    if (!user.systemUser) {
      return res.status(403).json({
        message: "Only admin access allowed",
      });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(400).json({
      message: "error occurred",
    });
  }
};
