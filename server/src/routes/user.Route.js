import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  loginUser,
  updateUserRoleByAdmin,
  updateUserPassword
} from "../controller/user.Controller.js";
import { protect } from "../Middleware/protect.Middleware.js";
import { adminOnly } from "../Middleware/adminOnly.Middleware.js";

const UserRouter = express.Router();

UserRouter.get("/users", getAllUsers);
UserRouter.post("/create_user", createUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/all_users/:id", protect, adminOnly, getUserById);
UserRouter.put("/update_user/:id", protect, updateUser);
UserRouter.delete("/delete_user/:id", protect, deleteUser);
// مسارات مباشرة تستخدمها لوحة تحكم الأدمن (بدون توكن)
UserRouter.patch("/:id", updateUser);
UserRouter.delete("/:id", deleteUser);
UserRouter.put("/update_user_role/:id", protect, adminOnly, updateUserRoleByAdmin);
UserRouter.put("/update_user_password/:id", protect, updateUserPassword);

export default UserRouter;

/*
import express from "express";
import {
getAllUsers, getUserById, updateUser, deleteUser ,createUser, loginUser
} from "../controller/user.Controller.js";
import { protect } from "../Middleware/protect.Middleware.js";
import { adminOnly } from "../Middleware/adminOnly.Middleware.js";

const UserRouter = express.Router();

UserRouter.get("/users", protect,adminOnly, getAllUsers);
UserRouter.post("/create_user", adminOnly, createUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/user/:id", protect, getUserById);
UserRouter.put("/user/:id", protect, updateUser);
UserRouter.delete("/user/:id", protect, deleteUser);

export default UserRouter;
*/
