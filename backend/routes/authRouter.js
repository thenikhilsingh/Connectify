const Router = require("express");
const { register, login } = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const authRouter = Router();

authRouter.post("/signup", registerValidator, register);
authRouter.post("/login", loginValidator, login);

module.exports = authRouter;
