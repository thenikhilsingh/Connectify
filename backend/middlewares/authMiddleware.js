const jwt = require("josnwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Token not provided!" });
  }
  console.log("token from auth middleware", token);
  const jwtToken = token.replace("Bearer", "").trim();
  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    const userData = await User.findOne({ email: isVerified.email }).select({
      password: 0,
    });

    req.user = userData;
    req.token = jwtToken;
    req.userId = userData._id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized. Invalid Token!" });
  }
};

module.exports = authMiddleware;
