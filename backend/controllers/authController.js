const User = require("../models/user");

const register = async (req, res) => {
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

module.exports = { register };
