import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
    getCategories,
    getCategoryTree,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/tree", getCategoryTree);
router.post("/", protect, authorize("ADMIN"), createCategory);
router.patch("/:id", protect, authorize("ADMIN"), updateCategory);
router.delete("/:id", protect, authorize("ADMIN"), deleteCategory);

export default router;
