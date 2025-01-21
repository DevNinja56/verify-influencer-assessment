import mongoose, { Schema } from "mongoose"
import { IClaim } from "./claim.document"

const platformSchema = new Schema({
  youtube: { type: Number, required: false },
  instagram: { type: Number, required: false },
  tiktok: { type: Number, required: false },
  twitter: { type: Number, required: false },
  other: { type: Number, required: false }
})

// Define the schema for the Claim model
export const ClaimSchema: Schema = new Schema(
  {
    influencerId: mongoose.Schema.Types.ObjectId,
    content: String,
    category: String,
    platform: platformSchema, //source
    verificationStatus: String,
    confidenceScore: Number, // trustScore
    source: String
  },
  {
    timestamps: true
  }
)

// Add a toJSON transform to the schema to manipulate the output
ClaimSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Export the model and return the IClaim interface
export default mongoose.model<IClaim>("Claim", ClaimSchema)
