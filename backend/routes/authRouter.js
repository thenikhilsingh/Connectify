const Router = require("express");
const {
  register,
  login,
  user,
  guestLogin,
} = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");
const authMiddleware = require("../middlewares/authMiddleware");

const authRouter = Router();

authRouter.post("/signup", registerValidator, register);
authRouter.post("/login", loginValidator, login);
authRouter.get("/user", authMiddleware, user);
authRouter.post("/guest", guestLogin);

module.exports = authRouter;
