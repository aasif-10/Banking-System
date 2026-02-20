const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendRegistrationEmail } = require("../services/email");
/* 
- user register controller
- POST /register
*/

module.exports.registerController = async (req, res) => {
  const { email, name, password } = req.body;
  const isExists = await userModel.findOne({ email: email });

  if (isExists) {
    return res.status(422).json({
      message: "User already exists with email.",
      status: "failed",
    });
  }

  const genSalt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, genSalt);

  const user = await userModel.create({
    email: email,
    name: name,
    password: hash,
  });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);
  res.status(201).json({
    message: "user created successfully",
    status: "passed",
  });

  await sendRegistrationEmail(user.email, user.name);
};
