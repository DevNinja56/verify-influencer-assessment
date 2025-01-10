import mongoose, { Schema } from "mongoose"
import { IResearchTask, ResearchTaskStatus } from "./research-task.document"

// Define the schema for the ResearchTask model
const ResearchTaskSchema: Schema = new Schema(
  {
    influencerId: {
      type: Schema.Types.ObjectId,
      ref: "Influencer",
      required: true
    },
    status: {
      type: String,
      enum: ResearchTaskStatus,
      default: ResearchTaskStatus.Pending
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    settings: {
      journals: [String],
      claimsLimit: Number,
      notes: String
    },
    results: {
      claims: [
        {
          type: [Schema.Types.ObjectId],
          ref: "Claim"
        }
      ],
      analysisStats: {
        totalClaims: Number,
        verifiedClaims: Number,
        questionableClaims: Number,
        debunkedClaims: Number
      }
    }
  },
  {
    timestamps: true
  }
)

// Add a toJSON transform to the schema to manipulate the output
ResearchTaskSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Export the model and return the IResearchTask interface
export default mongoose.model<IResearchTask>("ResearchTask", ResearchTaskSchema)
