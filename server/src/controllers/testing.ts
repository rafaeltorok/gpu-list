import type { Request, Response, NextFunction } from "express";
import express from "express";
import Gpu from "../models/gpu.js";

const testingRouter = express.Router();

// Resets the remote database by removing all previous data
testingRouter.post(
  "/reset",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await Gpu.deleteMany({});
      res.status(204).end();
    } catch (err: unknown) {
      next(err);
    }
  },
);

export default testingRouter;
