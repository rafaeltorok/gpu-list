export type GpuType = {
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
};

export type HideClockSpeeds = Omit<
  GpuType,
  "baseclock" | "boostclock" | "memclock"
>;

export type HideVram = Omit<GpuType, "vram" | "memtype">;

export type FormatGpuCalc = Omit<GpuType, "manufacturer" | "gpuline">;
