import { Router } from "express";
import multer from "multer";
import {
  getProducts,
  getProduct,
  createProduct,
  createProductJson,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authMiddleware, requireAdmin } from "../middleware/auth";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post(
  "/",
  authMiddleware,
  requireAdmin,
  upload.single("image"),
  createProduct
);
router.post("/json", authMiddleware, requireAdmin, createProductJson);
router.put(
  "/:id",
  authMiddleware,
  requireAdmin,
  upload.single("image"),
  updateProduct
);
router.delete("/:id", authMiddleware, requireAdmin, deleteProduct);

export default router;
