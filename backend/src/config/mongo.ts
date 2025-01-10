import mongoose from "mongoose"
import logging from "./logging"
import config from "./index"

const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGO.URL)
    logging.info(config.MONGO.NAMESPACE, "MongoDB connected successfully")
  } catch (error) {
    logging.error(config.MONGO.NAMESPACE, (error as Error).message)
    process.exit(1) // Exit process if MongoDB connection fails
  }
}

mongoose.set("strictQuery", false) // Optional depending on your setup

export default connectMongoDB
