// Middleware dependencies
import logger from "../utils/logger.js";
import mongoose from "mongoose";

// TypeScript types
import type { Request, Response, NextFunction } from "express";

function unknownEndpoint(_req: Request, res: Response) {
  res.status(404).send({ error: "unknown endpoint" });
}

function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof Error) logger.error(err.message);

  // Narrows down validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    let errors: Record<string, string> = {};

    Object.keys(err.errors).forEach((key: string) => {
      const error = err.errors[key];
      if (error) errors[key] = error.message;
    });

    return res.status(400).json({ errors: errors });
  }

  // Narrows down cast errors
  if (err instanceof mongoose.Error.CastError) {
    // Inspect the path to check if the error is caused by an invalid id or specs
    if (err.path === "_id") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    return res.status(400).json({
      errors: {
        [err.path]: `Invalid ${err.kind}`,
      },
    });
  }

  next(err);
}

export default { unknownEndpoint, errorHandler };
