import express from "express"
import InfluencerController from "../controllers/influencer.controller"

const router = express.Router()

// GET /influencer
router.get("/", InfluencerController.getAllInfluencers)

// GET /influencer/names
router.get("/names", InfluencerController.getAllInfluencersName)

// GET /influencer/analytics
router.get("/analytics", InfluencerController.influencersAnalytics)

// GET /influencer/:id
router.get("/:id", InfluencerController.getInfluencerById)

// Post /influencer
router.post("/", InfluencerController.addInfluencer)

// Post /influencer/research
router.post("/research", InfluencerController.processInfluencer)

export default router
