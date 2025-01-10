import { Response } from "express"

export const generalResponse = (res: Response, payload: { status: number; message: string; data?: unknown }) => {
  const { status, message, data } = payload
  return res.status(status).json({ status, message, data: data || null })
}
