import { Request, Response } from "express"
import { generalResponse } from "../utils/general-response.util"
import AuthService from "../services/auth.service"
import { AuthenticatedRequest } from "../interface"

const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const { token, user } = await AuthService.register({ username, password })
    generalResponse(res, {
      status: 200,
      message: "User registered successfully",
      data: { token, user }
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: (error as Error).message
    })
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const { token, user } = await AuthService.login({ username, password })
    generalResponse(res, {
      status: 200,
      message: "User logged in successfully",
      data: { token, user }
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: (error as Error).message
    })
  }
}

const me = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user
    generalResponse(res, {
      status: 200,
      message: "User fetched successfully",
      data: user
    })
  } catch (error) {
    generalResponse(res, {
      status: 500,
      message: (error as Error).message
    })
  }
}

export default {
  register,
  login,
  me
}
