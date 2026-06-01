import express from "express";
import {
  loginUser,
  registerUser,
  verifyUser,
  listUsers,
  removeUser,
  getProfile,
  updateProfile,
  addAddress,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify", verifyUser);
userRouter.post("/login", loginUser);

userRouter.get("/list", listUsers);
userRouter.delete("/remove/:id", removeUser);
userRouter.get("/profile", getProfile);
userRouter.put("/updateProfile", updateProfile);
userRouter.put("/addAddress", addAddress);

export default userRouter;
