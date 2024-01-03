var express = require("express");
const User = require("../models/Users");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authUser } = require("../middleware/auth");
require("dotenv").config;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* ============================================SIGN UP========================================================*/

router.post("/admin/signup", authUser, async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, passConfirm } =
      req.body;

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(passConfirm, saltRounds);
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPass,
    });

    const maxAge = 3 * 24 * 60 * 60;
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: maxAge,
      });

      return res.status(200).json({ user: user, authToken: token });
    } else {
      return res.status(500).json({ message: "internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

/* ============================================LOGIN========================================================*/
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const maxAge = 3 * 24 * 60 * 60;
    const user = await User.findOne({ email });

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: maxAge,
        });
        const currUser = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        return res.status(200).json({
          message: "logged in successfully",
          authToken: token,
          user: currUser,
        });
      } else {
        return res.status(401).json({ message: "invalid credentials" });
      }
    } else {
      return res.status(401).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
