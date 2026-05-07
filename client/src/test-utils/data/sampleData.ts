// TypeScript types
import type { GpuInputType } from "../../../../shared/types/types";

// Sample test data
const rtx5090: GpuInputType = {
  manufacturer: "NVIDIA",
  gpuline: "GeForce",
  model: "RTX 5090",
  cores: 21760,
  tmus: 680,
  rops: 176,
  vram: 32,
  bus: 512,
  memtype: "GDDR7",
  baseclock: 2017,
  boostclock: 2407,
  memclock: 28,
};

const gtx650: GpuInputType = {
  manufacturer: "NVIDIA",
  gpuline: "GeForce",
  model: "GTX 650",
  cores: 384,
  tmus: 32,
  rops: 16,
  vram: 1,
  bus: 128,
  memtype: "GDDR5",
  baseclock: 1058,
  boostclock: 1058,
  memclock: 5,
};

const rx9070xt: GpuInputType = {
  manufacturer: "AMD",
  gpuline: "Radeon",
  model: "RX 9070 XT",
  cores: 4096,
  tmus: 256,
  rops: 128,
  vram: 16,
  bus: 256,
  memtype: "GDDR6",
  baseclock: 1660,
  boostclock: 2970,
  memclock: 20,
};

const rx7900xtx: GpuInputType = {
  manufacturer: "AMD",
  gpuline: "Radeon",
  model: "RX 7900 XTX",
  cores: 6144,
  tmus: 384,
  rops: 192,
  vram: 24,
  bus: 384,
  memtype: "GDDR6",
  baseclock: 1855,
  boostclock: 2498,
  memclock: 20,
};

const b580: GpuInputType = {
  manufacturer: "Intel",
  gpuline: "Arc",
  model: "B580",
  cores: 2560,
  tmus: 160,
  rops: 80,
  vram: 12,
  bus: 192,
  memtype: "GDDR6",
  baseclock: 2670,
  boostclock: 2670,
  memclock: 19,
};

const g210: GpuInputType = {
  manufacturer: "NVIDIA",
  gpuline: "GeForce",
  model: "210",
  cores: 16,
  tmus: 8,
  rops: 4,
  vram: 0.512,
  bus: 64,
  memtype: "DDR3",
  baseclock: 520,
  boostclock: 520,
  memclock: 0.8,
};

export default {
  rtx5090,
  gtx650,
  rx9070xt,
  rx7900xtx,
  b580,
  g210,
};
