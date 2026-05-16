// Mongoose dependencies
import { Schema, model } from "mongoose";

// TypeScript types
import type { GpuType } from "../../../shared/types/types.ts";
import type { Types } from "mongoose";

interface GpuMongoDocument {
  manufacturer: string;
  gpuline: string;
  model: string;
  cores: number;
  tmus: number;
  rops: number;
  vram: number;
  bus: number;
  memtype: string;
  baseclock: number;
  boostclock: number;
  memclock: number;
  _id: Types.ObjectId;
  _v: number;
}

// Schema definition
const gpuSchema = new Schema<GpuType>({
  manufacturer: {
    type: String,
    required: [true, "Manufacturer is required"],
    trim: true,
    validate: {
      validator: (v: string) => v.trim().length > 0,
      message: "Manufacturer cannot be empty",
    },
  },
  gpuline: {
    type: String,
    required: false,
    trim: true,
  },
  model: {
    type: String,
    required: [true, "Model is required"],
    trim: true,
    validate: {
      validator: (v: string) => v.trim().length > 0,
      message: "Model cannot be empty",
    },
  },
  cores: {
    type: Number,
    required: [true, "Cores count is required"],
    min: [1, "Cores must be at least 1"],
  },
  tmus: {
    type: Number,
    required: [true, "TMUs count is required"],
    min: [1, "TMUs must be at least 1"],
  },
  rops: {
    type: Number,
    required: [true, "ROPs count is required"],
    min: [1, "ROPs must be at least 1"],
  },
  vram: {
    type: Number,
    required: [true, "VRAM amount is required"],
    min: [0.016, "VRAM must be at least 1"],
  },
  bus: {
    type: Number,
    required: [true, "Bus width is required"],
    min: [1, "Bus width must be at least 1"],
  },
  memtype: {
    type: String,
    required: [true, "Memory type is required"],
    trim: true,
    validate: {
      validator: (v: string) => v.trim().length > 0,
      message: "Memory type cannot be empty",
    },
  },
  baseclock: {
    type: Number,
    required: [true, "Base clock is required"],
    min: [1, "Base clock must be at least 1"],
  },
  boostclock: {
    type: Number,
    required: [true, "Boost clock is required"],
    min: [1, "Boost clock must be at least 1"],
  },
  memclock: {
    type: Number,
    required: [true, "Memory clock is required"],
    min: [0.01, "Memory clock must be at least 1"],
  },
});

gpuSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    // Explicitly type the Mongo object, since the original is of any type
    const obj = returnedObject as GpuMongoDocument;
    const transformedGpuObject: GpuType = {
      id: obj._id.toString(),
      manufacturer: obj.manufacturer,
      gpuline: obj.gpuline,
      model: obj.model,
      cores: obj.cores,
      tmus: obj.tmus,
      rops: obj.rops,
      vram: obj.vram,
      bus: obj.bus,
      memtype: obj.memtype,
      baseclock: obj.baseclock,
      boostclock: obj.boostclock,
      memclock: obj.memclock
    }
    return transformedGpuObject;
  },
});

const Gpu = model("Gpu", gpuSchema);
export default Gpu;
