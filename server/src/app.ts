// Server dependencies
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

// Middleware
import config from "./utils/config.js";
import middleware from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";

// Controllers
import gpusRouter from "./controllers/gpus.js";
import testingRouter from "./controllers/testing.js";

// Setting the MongoDB connection via Mongoose
mongoose.set("strictQuery", false);

if (config.MONGODB_URI) {
  logger.info("connecting to", config.MONGODB_URI);

  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      logger.info("connect to MongoDB");
    })
    .catch((error) => {
      logger.error("error connecting to MongoDB:", error.message);
    });
}

// Setting the Express server
const app = express();
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);
app.use(express.static("dist/main-client"));
app.use("/alt", express.static("dist/alt-client"));
app.use(express.json());

// Express routes
app.use("/api/gpus", gpusRouter);

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

// Error middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
