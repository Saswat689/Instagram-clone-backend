const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const checkValidationErrors = require("../middlewares/checkValidationErrors");

const { signup, login } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("username", "Please provide username").trim().not().isEmpty(),
    check("email", "Please provide a valid email id.")
      .trim()
      .isEmail()
      .normalizeEmail(),
  ],
  checkValidationErrors,
  signup
);

router.post(
  "/login",
  [
    check("email", "Please provide a valid email id.")
      .trim()
      .isEmail()
      .normalizeEmail(),
  ],
  checkValidationErrors,
  login
);

module.exports = router;
