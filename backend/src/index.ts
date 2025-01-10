import http from "http"
import express, { Express, NextFunction, Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import connectMongoDB from "./config/mongo"
import logging from "./config/logging"
import Routes from "./routes/index"
import dotenv from "dotenv"
import errorHandler from "./middlewares/error-handler.middleware"
import config from "./config"

dotenv.config()

// Express App Setup
const app: Express = express()
const NAMESPACE = "Server"

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

  res.on("finish", () => {
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    )
  })

  next()
})

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "success", message: "Welcome to Backend API.", data: null })
})
app.use(config.SERVER.API_PREFIX, Routes)

// Error handling middleware
app.use(errorHandler)

// Connect MongoDB
connectMongoDB()

// Create HTTP Server and Listen on PORT 4000
const httpServer = http.createServer(app)
const PORT = process.env.PORT || 4000

httpServer.listen(PORT, () => {
  logging.info(NAMESPACE, `Server running on http://localhost:${PORT}`)
})
