import express from "express"
import SeedDataController from "../controllers/seed-data.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = express.Router()

// GET /seed-data
router.get("/", SeedDataController.seedData)

export default router
