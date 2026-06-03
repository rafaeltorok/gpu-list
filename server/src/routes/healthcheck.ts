import type { Request, Response } from "express";
import express from "express";

const healthCheckRouter = express.Router();

// Return an ok message to ensure the Express server is working
healthCheckRouter.get("/", (_req: Request, res: Response) => {
  return res.status(200).send("Server is online");
});

export default healthCheckRouter;
