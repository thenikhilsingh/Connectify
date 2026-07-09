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

const user = async (req, res) => {
  try {
    const userData = req.user;
    return res.status(200).json({ userData });
  } catch (error) {
    console.log(`error from the user route: ${error}`);
  }
};

const guestLogin = async (req, res) => {
  try {
    const guest = await User.findOne({ email: "guest@gmail.com" });
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest account not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Guest Login Successfull!",
      token: await guest.generateToken(),
      userId: guest._id.toString(),
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "guest login failed!" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const loggedInUser = await User.findById(req.user._id);

    const isMatch = await loggedInUser.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    loggedInUser.password = newPassword;

    await loggedInUser.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Password change failed",
    });
  }
};

module.exports = { register, login, user, guestLogin, changePassword };
