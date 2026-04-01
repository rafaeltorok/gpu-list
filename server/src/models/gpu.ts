import { Schema, model } from "mongoose";
import type { GpuType } from "../types.ts";

const gpuSchema = new Schema<GpuType>({
  manufacturer: {
    type: String,
    required: [true, "Manufacturer is required"],
    trim: true,
    validate: {
      validator: (v) => v.trim().length > 0,
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
      validator: (v) => v.trim().length > 0,
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
      validator: (v) => v.trim().length > 0,
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
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Gpu = model("Gpu", gpuSchema);
export default Gpu;
