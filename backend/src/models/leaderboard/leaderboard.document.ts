import mongoose, { Document } from "mongoose"

export interface ILeaderboardEntry extends Document {
  influencerId: mongoose.Schema.Types.ObjectId 
  name: string
  trustScore: number
  followers: number
  verifiedClaims: number
  totalClaims: number
}
