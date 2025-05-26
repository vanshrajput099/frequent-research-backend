import { Router } from "express";
import { checkUsername, userController } from "../controllers/user.controller.js";
import { upload } from "../utils/multer.js";

export const userRouter = Router();

userRouter.route("/update").put(upload.single("profilePicture"), userController);
userRouter.route("/check-username").post(checkUsername);