import express from "express"
import categoryController from "../controllers/category.controller"

const router = express.Router()

// GET /categories
router.get("/", categoryController.getAllCategoriesController)

export default router
