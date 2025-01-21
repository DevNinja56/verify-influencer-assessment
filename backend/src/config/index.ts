import * as dotenv from "dotenv"
dotenv.config()

const config = {
  MONGO: {
    NAMESPACE: "MongoDB",
    URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/development"
  },
  SERVER: {
    NAMESPACE: "Server",
    API_PREFIX: process.env.API_PREFIX || "/api",
    PORT: process.env.PORT || 4000
  },
  JWT: {
    NAMESPACE: "JWT",
    SECRET: process.env.JWT_SECRET || "",
    EXPIRATION: process.env.JWT_EXPIRATION || "1h"
  },
  OPEN_AI: {
    NAMESPACE: "OpenAI",
    API_KEY: process.env.OPEN_AI_API_KEY || ""
  },
  SERP_API: {
    NAMESPACE: "SerpApi",
    API_KEY: process.env.SERP_API_KEY || ""
  }
}

export default config
