import express from "express"
import AuthController from "../controllers/auth.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = express.Router()

// POST /register
router.post("/register", AuthController.register)

// POST /login
router.post("/login", AuthController.login)

// GET /me
router.get("/me", authenticate, AuthController.me)

export default router
