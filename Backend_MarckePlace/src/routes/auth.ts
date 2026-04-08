import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  updateProfile,
  getMeController,
  getAdminStats,
  getAllUsers,
  deleteUserController,
  getAllOrders,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/orders", authMiddleware, getAllOrders);
router.get("/stats", authMiddleware, getAdminStats);
router.get("/users", authMiddleware, getAllUsers);
router.delete("/users/:id", authMiddleware, deleteUserController);

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("avatar")
  ],
  register
);
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  login
);

router.get("/me", authMiddleware, getMeController);

router.put("/updateProfile", authMiddleware, updateProfile);

export default router;
