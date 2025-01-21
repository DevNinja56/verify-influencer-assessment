import mongoose, { Schema } from "mongoose"
import { IInfluencer } from "./influencer.document"

// Define the schema for the Influencer model
const InfluencerSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    platform: { type: String, required: true },
    handle: { type: String, required: false },
    followerCount: { type: Number, required: false, default: 0 },
    yearlyRevenue: { type: Number, required: false, default: 0 },
    products: { type: Number, required: false, default: 0 },
    trustScore: { type: Number, required: false, default: 0 },
    influencerCategory: { type: String, required: false }
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
