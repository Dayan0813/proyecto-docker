import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getCart,
  addToCart,
  removeItem,
  checkout,
} from "../controllers/cartController";

const router = Router();

router.use(authMiddleware);
router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/item/:id", removeItem);
router.post("/checkout", checkout);

export default router;
