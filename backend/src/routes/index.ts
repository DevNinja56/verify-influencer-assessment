import express, { Express } from "express"
import AuthRoutes from "./auth.route"
import InfluencerRoutes from "./influencer.route"
import SeeDataRoutes from "./seed-data.route"

const app: Express = express()

// Auth routes
app.use("/auth", AuthRoutes)
// Influencer routes
app.use("/influencer", InfluencerRoutes)
// Seed data routes
app.use("/seed-data", SeeDataRoutes)

export default app
