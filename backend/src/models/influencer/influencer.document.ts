import { Document } from "mongoose"

export interface InfluencerClaimStats {
  totalClaims: number
  verifiedClaims: number
  questionableClaims: number
  debunkedClaims: number
}

// Define the schema for the Influencer model
export interface IInfluencer extends Document {
  name: string
  platform: string
  handle: string
  followerCount: number
  trustScore: number
  claimStats: InfluencerClaimStats
  createdAt: Date
  updatedAt: Date
}
