import mongoose, { Document } from "mongoose"

// Definition of the Claim document
export enum VerificationStatus {
  Pending = "Pending",
  Verified = "Verified",
  Questionable = "Questionable",
  Debunked = "Debunked"
}

export interface IClaim extends Document {
  influencerId: mongoose.Types.ObjectId
  content: string
  category: string
  platform: string
  verificationStatus: VerificationStatus
  confidenceScore: number
  createdAt: Date
  updatedAt: Date
}
