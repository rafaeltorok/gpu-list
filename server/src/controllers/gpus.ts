// Express router dependencies
import express from "express";
import Gpu from "../models/gpu.js";

// TypeScript types
import type { Request, Response, NextFunction } from "express";
import type {
  GpuType,
  FormatGpuCalc,
  HideClockSpeeds,
  HideVram,
} from "../types.js";

const gpusRouter = express.Router();

// GET all items from the database
gpusRouter.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const gpuList = await Gpu.find();
      return res.status(200).json(gpuList);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// Omit the Clocks Speeds for all Graphics Cards
gpusRouter.get(
  "/noclocks",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const gpus: HideClockSpeeds[] = await Gpu.find().select(
        "-baseclock -boostclock -memclock",
      );
      return res.json(gpus);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// Omit the VRAM amount and Memory Type for all Graphics Cards
gpusRouter.get(
  "/novram",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const gpus: HideVram[] = await Gpu.find().select("-vram -memtype");
      return res.json(gpus);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// Omit certain fields to leave out only the necessary for the GPUCalc apps
gpusRouter.get(
  "/gpucalc",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // lean() returns plain JavaScript objects
      const gpus = await Gpu.find().select("-manufacturer -gpuline").lean();
      const formattedGpus: FormatGpuCalc[] = gpus.map(
        ({ _id, __v, ...others }) => others,
      );
      return res.json(formattedGpus);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// GET a single item by it's id
gpusRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gpu = await Gpu.findById(req.params.id);
      if (!gpu) {
        return res.status(404).json({ error: "GPU not found" });
      }
      return res.status(200).json(gpu);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// POST a new graphics card on the database
gpusRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        manufacturer,
        gpuline,
        model,
        cores,
        tmus,
        rops,
        vram,
        bus,
        memtype,
        baseclock,
        boostclock,
        memclock,
      }: GpuType = req.body;

      const existingGpu = await Gpu.findOne({
        manufacturer: { $regex: new RegExp(`^${manufacturer}$`, "i") },
        gpuline: { $regex: new RegExp(`^${gpuline}$`, "i") },
        model: { $regex: new RegExp(`^${model}$`, "i") },
      });

      if (existingGpu) {
        return res
          .status(409)
          .json({
            error: "The graphics card has already been added to the list",
          });
      }

      const newGpu = new Gpu({
        manufacturer,
        gpuline,
        model,
        cores,
        tmus,
        rops,
        vram,
        bus,
        memtype,
        baseclock,
        boostclock,
        memclock,
      });

      const savedGpu = await newGpu.save();
      return res.status(201).json(savedGpu);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// PUT (update) a graphics card data
gpusRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateFields = req.body;

      // Ensure the request body is not empty
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "No fields provided for update" });
      }

      const updatedGpu = await Gpu.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedGpu) {
        return res.status(404).json({ error: "GPU not found" });
      }

      res.json(updatedGpu);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// DELETE a graphics card form the database
gpusRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gpu = await Gpu.findByIdAndDelete(req.params.id);
      if (!gpu) {
        return res.status(404).json({ error: "GPU not found" });
      }
      return res.status(204).end();
    } catch (err: unknown) {
      next(err);
    }
  },
);

export default gpusRouter;
