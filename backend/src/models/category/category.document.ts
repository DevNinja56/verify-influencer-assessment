import { Document } from "mongoose"

export interface ICategory extends Document {
  categoryName: { type: string; required: true; unique: true }
}
