import express from "express"
import ClaimController from "../controllers/claim.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = express.Router()

// GET /claim/influencer/:id
router.get("/influencer/:influencerId", ClaimController.getClaimsForInfluencer)

// GET /claim/categories
router.get("/categories", ClaimController.getClaimCategories)

export default router
