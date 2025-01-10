import mongoose, { Schema } from "mongoose"
import { IInfluencer } from "./influencer.document"

// Define the schema for the Influencer model
const InfluencerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    platform: { type: String, required: true },
    handle: { type: String, required: true },
    followerCount: { type: Number, required: true },
    trustScore: { type: Number, default: 0 },
    claimStats: {
      totalClaims: { type: Number, default: 0 },
      verifiedClaims: { type: Number, default: 0 },
      questionableClaims: { type: Number, default: 0 },
      debunkedClaims: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
)

// Add a toJSON transform to the schema to manipulate the output
InfluencerSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Export the model and return the IInfluencer interface
export default mongoose.model<IInfluencer>("Influencer", InfluencerSchema)
