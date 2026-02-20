const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "User not logged in",
      status: "failed",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: decode.userId });
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({
      message: "Token invalid!",
      status: "failed",
    });
  }
};
