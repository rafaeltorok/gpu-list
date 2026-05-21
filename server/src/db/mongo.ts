// Connection dependencies
import mongoose from "mongoose";

// Middleware
import config from "../utils/config.js";
import logger from "../utils/logger.js";

export default async function connectToDatabase() {
  // Check if it is already connected
  if (mongoose.connection.readyState === mongoose.STATES.connected) {
    return;
  }

  // Check if it is still trying to connect
  if (mongoose.connection.readyState === mongoose.STATES.connecting) {
    // Avoid duplicate attempts when trying to connect
    return;
  }

  // Setting the MongoDB connection via Mongoose
  mongoose.set("strictQuery", false);

  // If the MongoDB URI is present, connect to the database
  if (config.MONGODB_URI) {
    logger.info("connecting to", config.MONGODB_URI);

    try {
      await mongoose.connect(config.MONGODB_URI);
      logger.info("connected to MongoDB");
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(`Failed to connect to MongoDB: ${err.message}`, {
          cause: err,
        });
      } else {
        const unknownError = new Error(String(err));
        throw new Error(
          `Failed to connect to MongoDB: ${unknownError.message}`,
          {
            cause: err,
          },
        );
      }
    }
  } else {
    throw new Error("Invalid MongoDB URI");
  }
}
