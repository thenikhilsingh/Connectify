const User = require("../models/user");
const { validationResult } = require("../validators/authValidator");

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ message: "email already exists!" });
    }

    const userCreated = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(200).json({
      success: true,
      message: "user registered successfully!",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "user registeration failed!" });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email: email });
    if (!userExists) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const isPasswordValid = await userExists.comparePassword(password);
    if (isPasswordValid) {
      res.status(200).json({
        success: true,
        message: "Login Successfull!",
        token: await userExists.generateToken(),
        userId: userExists._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password!" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "user login failed!" });
  }
};

module.exports = { register, login };
