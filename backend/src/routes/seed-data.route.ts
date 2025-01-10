import express from "express"
import SeedDataController from "../controllers/seed-data.controller"

const router = express.Router()

// GET /seed-data
router.get("/", SeedDataController.seedData)

export default router
