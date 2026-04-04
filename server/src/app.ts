// Server dependencies
import express from "express";
import cors from "cors";
import morgan from "morgan";

// Middleware
import middleware from "./middlewares/errorHandler.js";

// Controllers
import gpusRouter from "./routes/gpus.js";
import testingRouter from "./routes/testing.js";

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
