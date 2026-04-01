function calculatePerformance(gpu) {
  return [
    getFp32(gpu.model, gpu.cores, gpu.boostclock),
    getTextureRate(gpu.tmus, gpu.boostclock),
    getPixelRate(gpu.rops, gpu.boostclock),
    getBandwidth(gpu.bus, gpu.memclock),
  ];
}

function getFp32(model, cores, coreclock) {
  const factor =
    model.toLowerCase().includes("rx 7") ||
    model.toLowerCase().includes("rx 90")
      ? 4
      : 2;
  const fp32Performance = (cores * coreclock * factor) / 1000000;
  return fp32Performance < 1
    ? (fp32Performance * 1000).toFixed(2) + " GFLOPS"
    : fp32Performance.toFixed(2) + " TFLOPS";
}

function getTextureRate(tmus, coreclock) {
  return ((tmus * coreclock) / 1000).toFixed(2) + " GTexel/s";
}

function getPixelRate(rops, coreclock) {
  return ((rops * coreclock) / 1000).toFixed(2) + " GPixel/s";
}

function getBandwidth(bus, memclock) {
  return ((bus * memclock) / 8).toFixed(2) + " GB/s";
}

export default calculatePerformance;
