// Vitest
import { describe, expect, test } from "vitest";

// Util
import generateGpuDomId from "../../../../shared/utils/generateGpuDomId";

// Test data
import sampleData from "../../test-utils/data/fixtures";

//Tests
describe("Testing the generate GPU DOM ID util", () => {
  describe("valid inputs", () => {
    test("a valid GPU object should return a proper id", () => {
      const gpu = sampleData.rtx5090;

      const domId = generateGpuDomId(gpu);

      expect(domId).toBe("nvidia-geforce-rtx-5090");
    });

    test("the gpuline field is optional", () => {
      const gpu = {
        ...sampleData.rtx5090,
        gpuline: "",
      };

      const domId = generateGpuDomId(gpu);

      expect(domId).toBe("nvidia-rtx-5090");
    });

    test("the output should not contain leading and trailing whitespaces", () => {
      const gpu = {
        ...sampleData.rtx5090,
        manufacturer: "  NVIDIA ",
        gpuline: "  GeForce  ",
        model: "  RTX 5090   ",
      };

      const domId = generateGpuDomId(gpu);

      expect(domId).toBe("nvidia-geforce-rtx-5090");
    });

    test("multiple whitespaces should be converted into a single dash", () => {
      const gpu = {
        ...sampleData.rx9070xt,
        model: "   RX    9070   XT",
      };

      const domId = generateGpuDomId(gpu);

      expect(domId).toBe("amd-radeon-rx-9070-xt");
    });
  });

  describe("invalid inputs", () => {
    test("an empty manufacturer field", () => {
      const gpu = {
        ...sampleData.rtx5090,
        manufacturer: "",
      };

      const domId = generateGpuDomId(gpu);

      // Confirm only an empty string is returned
      expect(domId).toBe("");
    });

    test("an empty model field", () => {
      const gpu = {
        ...sampleData.rtx5090,
        model: "",
      };

      const domId = generateGpuDomId(gpu);

      // Confirm only an empty string is returned
      expect(domId).toBe("");
    });

    test("passing no input value", () => {
      // @ts-expect-error - The empty input is intentional, no need for type checking
      const domId = generateGpuDomId();

      // Confirm only an empty string is returned
      expect(domId).toBe("");
    });

    test("malformed input value", () => {
      const invalidInput = { ...sampleData.rtx5090, manufacturer: undefined, model: undefined };

      // @ts-expect-error - The invalid object is intentional, no need for type checking
      const domId = generateGpuDomId(invalidInput);

      // Confirm only an empty string is returned
      expect(domId).toBe("");
    });
  });
});
