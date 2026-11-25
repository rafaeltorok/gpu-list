// Vitest
import { describe, expect, test } from "vitest";

// Util
import displayVramAmount from "../../utils/displayVramAmount";

// Test data
import sampleData from "../../test-utils/data/fixtures";

// Tests
describe("testing the display vram amount util", () => {
  describe("valid VRAM amounts", () => {
    test("an amount measured in GB should be properly displayed", () => {
      // Get the VRAM amount
      const vramAmount = displayVramAmount(sampleData.rtx5090.vram);

      // Assert it has the correct suffix
      expect(vramAmount).toEqual("32GB");
    });

    test("an amount measured in MB should be properly displayed", () => {
      // Get the VRAM amount
      const vramAmount = displayVramAmount(sampleData.g210.vram);

      // Assert it has the correct suffix
      expect(vramAmount).toEqual("512MB");
    });

    test("1 should be returned in GB", () => {
      // Get the VRAM amount
      const vramAmount = displayVramAmount(sampleData.gtx650.vram);

      // Assert it has the correct suffix
      expect(vramAmount).toEqual("1GB");
    });

    test("any value below 1 should be returned in MB", () => {
      // Get the VRAM amount
      const vramAmount = displayVramAmount(0.9);

      // Assert it has the correct suffix
      expect(vramAmount).toEqual("900MB");
    });
  });

  describe("invalid VRAM amounts", () => {
    test("0 should not be accepted", () => {
      const vramAmount = displayVramAmount(0);

      // Assert a not available value is returned
      expect(vramAmount).toEqual("N/A");
    });

    test("negative amounts should not be accepted", () => {
      const vramAmount = displayVramAmount(-1);

      // Assert a not available value is returned
      expect(vramAmount).toEqual("N/A");
    });

    test("string amounts should not be accepted", () => {
      // @ts-expect-error - purposely passing an invalid format to the function
      const vramAmount = displayVramAmount("1");

      // Assert a not available value is returned
      expect(vramAmount).toEqual("N/A");
    });

    test("other non-numeric amounts should not be accepted", () => {
      // @ts-expect-error - purposely passing an invalid format to the function
      let vramAmount = displayVramAmount(true);

      // Assert a not available value is returned
      expect(vramAmount).toEqual("N/A");

      // @ts-expect-error - purposely passing an invalid format to the function
      vramAmount = displayVramAmount(undefined);

      // Assert a not available value is returned
      expect(vramAmount).toEqual("N/A");

      // @ts-expect-error - purposely passing an invalid format to the function
      vramAmount = displayVramAmount(null);

      // Assert a not available value is returned
      expect(vramAmount).toEqual("N/A");
    });
  });
});
