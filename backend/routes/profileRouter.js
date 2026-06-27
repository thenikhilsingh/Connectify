const Router = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { updateProfile } = require("../controllers/profileController");
const upload = require("../middlewares/multerMiddleware");

const profileRouter = Router();

profileRouter.patch(
  "/",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateProfile,
);

module.exports = profileRouter;
