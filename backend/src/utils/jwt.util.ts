import jwt from "jsonwebtoken"
import config from "../config"

export const signJwt = (payload: string | object | Buffer) => {
  return jwt.sign(payload, config.JWT.SECRET, { expiresIn: config.JWT.EXPIRATION })
}

export const verifyJwt = (token: string) => {
  return jwt.verify(token, config.JWT.SECRET) as { id: string }
}
