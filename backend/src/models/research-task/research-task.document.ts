import mongoose, { Document } from "mongoose"

export enum ResearchTaskStatus {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed"
}

export interface ResearchTaskSettings {
  journals: string[]
  claimsLimit: number
  notes: string
}

export interface ResearchTaskAnalysisStats {
  totalClaims: number
  verifiedClaims: number
  questionableClaims: number
  debunkedClaims: number
}

export interface ResearchTaskResult {
  claims: mongoose.Types.ObjectId[]
  analysisStats: ResearchTaskAnalysisStats
}

// Define the schema for the Research Task model
export interface IResearchTask extends Document {
  influencerId: mongoose.Types.ObjectId
  status: ResearchTaskStatus
  progress: number
  settings: ResearchTaskSettings
  results: ResearchTaskResult
  createdAt: Date
  updatedAt: Date
}
