// Vitest
import { describe, expect, test } from "vitest";

// Util
import calculatePerformance from "../../../../shared/utils/calculatePerformance";

// Test data
import sampleData from "../data/sampleData";

// Tests
describe("Testing the calculate performance util", () => {
  describe("Valid GPU data", () => {
    test("a modern graphics card performance is correctly calculated", () => {
      // Calculate the performance
      const performance: string[] = calculatePerformance(sampleData.rtx5090);
      
      // Assert the results are correct
      expect(performance).toStrictEqual(["104.75 TFLOPS", "1636.76 GTexel/s", "423.63 GPixel/s", "1792.00 GB/s"]);
    });

    test("the GFLOPS FP32 performance suffix is correctly returned", () => {
      // Calculate the performance
      const performance: string[] = calculatePerformance(sampleData.gtx650);
      
      // Assert the results are correct
      expect(performance).toStrictEqual(["812.54 GFLOPS", "33.86 GTexel/s", "16.93 GPixel/s", "80.00 GB/s"]);
    });

    test("the FP32 performance for the Radeon RX 9000 Series is correctly calculated", () => {
      // RDNA4 cards such as the Radeon RX 9000 series have 4 instructions-per-clock
      const performance: string[] = calculatePerformance(sampleData.rx9070xt);
      
      // Assert the results are correct
      expect(performance).toStrictEqual(["48.66 TFLOPS", "760.32 GTexel/s", "380.16 GPixel/s", "640.00 GB/s"]);
    });

    test("the FP32 performance for the Radeon RX 7000 Series is correctly calculated", () => {
      // RDNA3 cards such as the Radeon RX 7000 series have 4 instructions-per-clock
      const performance: string[] = calculatePerformance(sampleData.rx7900xtx);
      
      // Assert the results are correct
      expect(performance).toStrictEqual(["61.39 TFLOPS", "959.23 GTexel/s", "479.62 GPixel/s", "960.00 GB/s"]);
    });
  });

  describe("Zero is an invalid specification value", () => {
    test("invalid number of GPU Cores", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        cores: 0
      }

      // Calculate the performance with the invalid data
      const performance: string[] = calculatePerformance(invalidData);

      // Assert the FP32 performance is invalid
      expect(performance).toStrictEqual(["N/A", "1636.76 GTexel/s", "423.63 GPixel/s", "1792.00 GB/s"]);
    });

    test("invalid number of TMUs", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        tmus: 0
      }

      // Calculate the performance with the invalid data
      const performance: string[] = calculatePerformance(invalidData);

      // Assert the Texture Rate is invalid
      expect(performance).toStrictEqual(["104.75 TFLOPS", "N/A", "423.63 GPixel/s", "1792.00 GB/s"]);
    });

    test("invalid number of ROPs", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        rops: 0
      }

      // Calculate the performance with the invalid data
      const performance: string[] = calculatePerformance(invalidData);

      // Assert the Pixel Rate is invalid
      expect(performance).toStrictEqual(["104.75 TFLOPS", "1636.76 GTexel/s", "N/A", "1792.00 GB/s"]);
    });

    test("invalid Core Clock speed", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        boostclock: 0
      }

      // Calculate the performance with the invalid data
      const performance: string[] = calculatePerformance(invalidData);

      // Assert all GPU core related performances are invalid
      expect(performance).toStrictEqual(["N/A", "N/A", "N/A", "1792.00 GB/s"]);
    });

    test("invalid memory Bus width", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        bus: 0
      }

      // Calculate the performance with the invalid data
      const performance: string[] = calculatePerformance(invalidData);

      // Assert the Memory Bandwidth is invalid
      expect(performance).toStrictEqual(["104.75 TFLOPS", "1636.76 GTexel/s", "423.63 GPixel/s", "N/A"]);
    });

    test("invalid Memory Clock speed", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        memclock: 0
      }

      // Calculate the performance with the invalid data
      const performance: string[] = calculatePerformance(invalidData);

      // Assert the Memory Bandwidth is invalid
      expect(performance).toStrictEqual(["104.75 TFLOPS", "1636.76 GTexel/s", "423.63 GPixel/s", "N/A"]);
    });
  });

  describe("Negative values are invalid specifications", () => {
    test("negative core related values", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        cores: -1,
        tmus: -1,
        rops: -1
      }

      // Calculate the performance with the invalid data
      const performance: string[] = calculatePerformance(invalidData);

      // Assert all GPU core related performances are invalid
      expect(performance).toStrictEqual(["N/A", "N/A", "N/A", "1792.00 GB/s"]);
    });

    test("negative Core Clock speed", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        boostclock: -1
      }

      // Calculate the performance with the invalid data
      const performance: string[] = calculatePerformance(invalidData);

      // Assert all GPU core related performances are invalid
      expect(performance).toStrictEqual(["N/A", "N/A", "N/A", "1792.00 GB/s"]);
    });

    test("Bus width of negative bits", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        bus: -1
      }

      // Calculate the performance with the invalid data
      const performance: string[] = calculatePerformance(invalidData);

      // Assert the Memory Bandwidth is invalid
      expect(performance).toStrictEqual(["104.75 TFLOPS", "1636.76 GTexel/s", "423.63 GPixel/s", "N/A"]);
    });

    test("negative Memory Clock speed", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        memclock: -1
      }

      // Calculate the performance with the invalid data
      const performance: string[] = calculatePerformance(invalidData);

      // Assert the Memory Bandwidth is invalid
      expect(performance).toStrictEqual(["104.75 TFLOPS", "1636.76 GTexel/s", "423.63 GPixel/s", "N/A"]);
    });
  });

  describe("testing with other invalid values for specifications", () => {
    test("invalid core related values", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        cores: null,
        tmus: undefined,
        rops: "100"
      }

      // Calculate the performance with the invalid data
      // @ts-expect-error
      const performance: string[] = calculatePerformance(invalidData);

      // Assert all GPU core related performances are invalid
      expect(performance).toStrictEqual(["N/A", "N/A", "N/A", "1792.00 GB/s"]);
    });

    test("null value for clock speed", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        boostclock: null
      }

      // Calculate the performance with the invalid data
      // @ts-expect-error
      const performance: string[] = calculatePerformance(invalidData);

      // Assert all GPU core related performances are invalid
      expect(performance).toStrictEqual(["N/A", "N/A", "N/A", "1792.00 GB/s"]);
    });

    test("boolean value for Bus Width", () => {
      const invalidData = {
        ...sampleData.rtx5090,
        bus: true
      }

      // Calculate the performance with the invalid data
      // @ts-expect-error
      const performance: string[] = calculatePerformance(invalidData);

      // Assert the Memory Bandwidth is invalid
      expect(performance).toStrictEqual(["104.75 TFLOPS", "1636.76 GTexel/s", "423.63 GPixel/s", "N/A"]);
    });
  });
});
