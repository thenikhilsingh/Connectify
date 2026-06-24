const Router = require("express");
const { register } = require("../controllers/authController");

const authRouter = Router();

authRouter.post("/signup", register);

module.exports = authRouter;
