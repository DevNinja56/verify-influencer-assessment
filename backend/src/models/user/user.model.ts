import mongoose, { Schema } from "mongoose"
import { IUser } from "./user.document"

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

export default mongoose.model<IUser>("User", UserSchema)
