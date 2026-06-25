const Router = require("express");
const { register, login, user } = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");
const authMiddleware = require("../middlewares/authMiddleware");

const authRouter = Router();

authRouter.post("/signup", registerValidator, register);
authRouter.post("/login", loginValidator, login);
authRouter.get("/user", authMiddleware, user);

module.exports = authRouter;
