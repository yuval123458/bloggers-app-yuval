const httpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const getAllUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new httpError("could not find users!", 404));
  }

  try {
    users = users.map((user) => user.toObject({ getters: true }));
  } catch (error) {
    return next(new httpError("could not map users!", 404));
  }

  res.status(200).json({ users: users });
};

const signUpNewUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new httpError("invalid data, please try again", 422));
  }

  let existed;
  try {
    existed = await User.findOne({ email: email });
  } catch (error) {
    return next(new httpError("Sign Up failed!", 500));
  }

  if (existed) {
    return next(
      new httpError(
        "this user is already in our database, please try a different email address",
        422
      )
    );
  }

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new httpError("could not hash password", 500));
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashPassword,
    places: [],
  });
  try {
    await newUser.save();
  } catch (err) {
    return next(new httpError("Could not save new user!", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      config.get("JWT_KEY"),
      { expiresIn: "1hr" }
    );
  } catch (err) {
    return next(new httpError("could not generate token in signUp", 422));
  }

  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token });
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;

  let verifiedData;

  try {
    verifiedData = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new httpError("Could not validate your email please try again!", 500)
    );
  }
  if (!verifiedData) {
    return next(
      new httpError("Could not validate your password, please try again!", 401)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, verifiedData.password);
  } catch (err) {
    return next(
      new httpError("could compare password with hash password", 500)
    );
  }
  if (!isValidPassword) {
    return next(new httpError("password is incorrect", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: verifiedData.id, email: verifiedData.email },
      config.get("JWT_KEY"),
      { expiresIn: "1hr" }
    );
  } catch (err) {
    return next(new httpError("Could not generate token in logging In!", 422));
  }

  res.status(200).json({
    userId: verifiedData.id,
    email: verifiedData.email,
    token: token,
  });
};

exports.getAllUsers = getAllUsers;
exports.signUpNewUser = signUpNewUser;
exports.Login = Login;
