// Connection dependencies
import mongoose from "mongoose";

// Middleware
import config from "../utils/config.js";
import logger from "../utils/logger.js";

export default async function connectToDatabase() {
  // Check if it is already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Setting the MongoDB connection via Mongoose
  mongoose.set("strictQuery", false);

  // If the MongoDB URI is present, connect to the database
  if (config.MONGODB_URI) {
    logger.info("connecting to", config.MONGODB_URI);
    
    try {
      await mongoose.connect(config.MONGODB_URI);
      logger.info("connect to MongoDB");
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error(String(err));
      }
    }
  } else {
    throw new Error("Invalid MongoDB URI");
  }
}
