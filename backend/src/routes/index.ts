import express, { Express } from "express"
import InfluencerRoutes from "./influencer.route"
import SeeDataRoutes from "./seed-data.route"

const app: Express = express()

// Influencer routes
app.use("/influencer", InfluencerRoutes)
// Seed data routes
app.use("/seed-data", SeeDataRoutes)

export default app
