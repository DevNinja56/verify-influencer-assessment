import mongoose, { Schema } from "mongoose"
import { ICategory } from "./category.document"

export const CategorySchema: Schema = new Schema(
  {
    categoryName: { type: String, required: true, unique: true }
  },
  {
    timestamps: true
  }
)

// Add a toJSON transform to the schema to manipulate the output
CategorySchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Export the model and return the IClaimCategory interface
export default mongoose.model<ICategory>("Categories", CategorySchema)
