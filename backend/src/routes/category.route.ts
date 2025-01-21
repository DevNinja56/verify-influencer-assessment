import express from "express"
import categoryController from "../controllers/category.controller"

const router = express.Router()

// GET /categories
router.get("/", categoryController.getAllCategories)

// DELETE /categories/:id
router.delete("/:id", categoryController.deleteCategory)

export default router
