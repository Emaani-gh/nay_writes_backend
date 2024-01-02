const jwt = require("jsonwebtoken");
const User = require("../models/Users");
require("dotenv").config();

const authUser = async (req, res, next) => {
  try {
    const tokenWithBearer = req.headers["authorization"];

    if (!tokenWithBearer || !tokenWithBearer.startsWith("Bearer ")) {
      console.log("No token provided or invalid format");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = tokenWithBearer.split(" ")[1];

    if (token) {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id).select("-password");
      req.currentuser = user;
      next();
    } else {
      console.log("Invalid token");
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Token Invalid" });
  }
};

module.exports = {
  authUser,
};
