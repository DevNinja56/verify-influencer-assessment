import mongoose, { Schema } from "mongoose"
import { ILeaderboardEntry } from "./leaderboard.document"

const LeaderboardSchema: Schema = new Schema({
  influencerId: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer", required: true },
  name: { type: String, required: true },
  trustScore: { type: Number, required: true },
  verifiedClaims: { type: Number, required: true },
  totalClaims: { type: Number, required: true }
})

export default mongoose.model<ILeaderboardEntry>("Leaderboard", LeaderboardSchema)
