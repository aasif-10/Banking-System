const express = require("express");
const router = express.Router();

router.post("/logout", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  res.clearCookie("token");
  await tokenBlacklistModel.create({ token });
  return res.status(200).json({ message: "Logged out successfully" });
});
