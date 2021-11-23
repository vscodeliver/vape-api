require("dotenv").config();
const router = require("express").Router();
const isEmail = require("validator/lib/isEmail");
let jwt = require("jsonwebtoken");
const User = require("../models/User");
const { promisify } = require("util");
const bcrypt = require("bcrypt");

jwt = {
  sign: promisify(jwt.sign.bind(jwt)),
};

router.post("/sign_up", verifyCredentials, async (req, res) => {
  const { email, password } = req.body;

  if (
    await User.exists({
      email,
    })
  ) {
    return res.status(402).json({
      ok: false,
      error: `The user with email address <${email}> already exists`,
    });
  }

  let hash;

  try {
    hash = await bcrypt.hash(password, 10);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error:
        "Something went wrong during signing up. Please try again a bit later.",
    });
  }

  const user = {
    email,
    password: hash,
  };

  User.create(user);

  res.status(201).json({
    ok: true,
    message: `User has been successfully created`,
  });
});

router.post("/sign_in", verifyCredentials, async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne(
    { email },
    {
      _id: 1,
      // createdAt: 0,
      // updatedAt: 0,
      email: 1,
      password: 1,
    }
  );

  if (!user) {
    return notFoundError(res);
  }

  console.log("User object:", user);

  const samePassword = await bcrypt.compare(password, user.password);

  if (!samePassword) {
    return notFoundError(res);
  }

  const payload = {
    _id: user._id,
    email: user.email,
  };

  const token = await jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "3d",
  });

  res.json({ token });
});

function verifyCredentials(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).json({
      ok: false,
      error: "You have provided invalid credentials",
    });
  }

  if (!isEmail(email)) {
    return res.status(403).json({
      ok: false,
      error: "You have provided invalid email address",
    });
  }

  console.log("Email:", email);
  console.log("Password:", password);

  next();
}

function notFoundError(response) {
  return response.status(403).json({
    ok: false,
    error: "You have been provided invalid email address and/or password",
  });
}

module.exports = router;
