import type { GpuInputType } from "../../../shared/types/types";

export const gpuList: GpuInputType[] = [
  {
    // Index 0
    manufacturer: "NVIDIA",
    gpuline: "GeForce",
    model: "RTX 3060",
    cores: 3584,
    tmus: 112,
    rops: 48,
    vram: 12,
    bus: 192,
    memtype: "GDDR6",
    baseclock: 1320,
    boostclock: 1777,
    memclock: 15,
  },
  {
    // Index 1
    manufacturer: "NVIDIA",
    gpuline: "GeForce",
    model: "GTX 970",
    cores: 1664,
    tmus: 104,
    rops: 56,
    vram: 4,
    bus: 256,
    memtype: "GDDR5",
    baseclock: 1050,
    boostclock: 1178,
    memclock: 7,
  },
  {
    // Index 2
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
  },
  {
    // Index 3
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
  },
  {
    // Index 4
    manufacturer: "NVIDIA",
    gpuline: "",
    model: "RTX PRO 6000 Blackwell",
    cores: 24064,
    tmus: 752,
    rops: 192,
    vram: 96,
    bus: 512,
    memtype: "GDDR7",
    baseclock: 1590,
    boostclock: 2617,
    memclock: 28,
  }
];
