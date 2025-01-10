import { Request, Response, NextFunction } from "express"
import logging from "../config/logging"
import config from "../config"

export interface AppError extends Error {
  statusCode?: number
}

// Middleware to handle errors
const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  // Default to 500 if no status code is set
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  logging.error(config.SERVER.NAMESPACE, `[Error] ${req.method} ${req.url} - ${message}`)

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  })

  next()
}

export default errorHandler
