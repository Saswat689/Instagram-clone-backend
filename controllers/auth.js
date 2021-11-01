const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWTOptions = {
  algorithm: "HS256",
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //check is user already exist
    const userexists = await User.findOne({
      $or: [{ email: email }, { username: username }],
    }).exec();

    if (userexists) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();
    const payload = {
      userId: result._id,
      username: result.username,
      userImage: "",
    };
    const accessToken = jwt.sign(payload, 'secure_text', JWTOptions);

    res.status(200).json({
      message: "Signup successfull",
      token: accessToken,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Some error occurred",
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) {
      console.log("in this");
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false
      });
    }

    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    console.log(isValidPassword);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false
      });
    }

    const payload = {
      userId: foundUser._id,
      username: foundUser.username,
      userImage: foundUser.userImage,
    };
    const accessToken = jwt.sign(payload, 'secure_text', JWTOptions);

    res.status(200).json({
      userInfo: {
        userId: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        totalFollowers: foundUser.followers.length,
        totalPosts: foundUser.posts.length,
      },
      token: accessToken,
      message: "Login successfull",
      success: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some error occurred",
      success: false,
    });
  }
};
