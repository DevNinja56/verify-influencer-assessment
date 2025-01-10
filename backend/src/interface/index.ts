import { Request } from "express"
import { IUser } from "../models/user/user.document"

export interface AuthenticatedRequest extends Request {
  user?: IUser
}
