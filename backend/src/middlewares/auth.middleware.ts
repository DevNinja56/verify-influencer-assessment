import { Request, Response, NextFunction } from "express"
import { generalResponse } from "../utils/general-response.util"
import { verifyJwt } from "../utils/jwt.util"
import User from "../models/user/user.model"
import { AuthenticatedRequest } from "../interface"

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || ""
    if (!token) {
      return generalResponse(res, { status: 401, message: "No token provided" })
    }

    const decoded = verifyJwt(token)
    if (!decoded) return generalResponse(res, { status: 401, message: "Invalid token" })

    // Find user by id from token
    const user = await User.findById(decoded.id)
    if (!user) return generalResponse(res, { status: 401, message: "Invalid token" })

    // Attach user to request object
    req.user = user
    next()
  } catch (error) {
    generalResponse(res, { status: 500, message: (error as Error).message })
  }
}
