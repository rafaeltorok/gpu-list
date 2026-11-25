// Vitest
import { describe, expect, test } from "vitest";

// Util
import getBrand from "../../utils/getBrand";

// Test data
import sampleData from "../../test-utils/data/fixtures";

// Helper functions
function assertBrandName(fullModel: string, expectedResult: string) {
  // Get the brand name
  const brand = getBrand(fullModel);

  // Assert the expected result is returned
  expect(brand).toEqual(expectedResult);
}

// Tests
describe("testing the get brand util", () => {
  test("manufacturer names should take precedence over line names", () => {
    // Get a sample card
    const gpu = sampleData.rx9070xt;

    // Assert the correct brand name is returned
    assertBrandName(`${gpu.manufacturer} GeForce ${gpu.model}`, "amd");
  });

  describe("valid manufacturer names", () => {
    test("a NVIDIA card should get the correct brand name", () => {
      // Get a sample card
      const gpu = sampleData.rtx5090;

      // Assert the correct brand name is returned
      assertBrandName(`${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`, "nvidia");
    });

    test("a AMD card should get the correct brand name", () => {
      // Get a sample card
      const gpu = sampleData.rx9070xt;

      // Assert the correct brand name is returned
      assertBrandName(`${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`, "amd");
    });

    test("a Intel card should get the correct brand name", () => {
      // Get a sample card
      const gpu = sampleData.b580;

      // Assert the correct brand name is returned
      assertBrandName(`${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`, "intel");
    });
  });

  describe("valid gpu line names", () => {
    test("a GeForce card should get the correct brand name", () => {
      // Get a sample card
      const gpu = sampleData.rtx5090;

      // Assert the correct brand name is returned
      assertBrandName(`${gpu.gpuline} ${gpu.model}`, "nvidia");
    });

    test("a Radeon card should get the correct brand name", () => {
      // Get a sample card
      const gpu = sampleData.rx9070xt;

      // Assert the correct brand name is returned
      assertBrandName(`${gpu.gpuline} ${gpu.model}`, "amd");
    });

    test("an Arc card should get the correct brand name", () => {
      // Get a sample card
      const gpu = sampleData.b580;

      // Assert the correct brand name is returned
      assertBrandName(`${gpu.gpuline} ${gpu.model}`, "intel");
    });
  });

  describe("testing against formatting issues",() => {
    test("the util should be case insensitive", () => {
      // Test against an uppercase manufacturer name
      const firstGpu = sampleData.rtx5090;

      // Assert the correct brand name is returned
      assertBrandName(`${firstGpu.manufacturer.toUpperCase()} ${firstGpu.model}`, "nvidia");

      // Test against an uppercase line name
      const secondGpu =sampleData.rx7900xtx;

      // Assert the correct brand name is returned
      assertBrandName(`${secondGpu.gpuline.toUpperCase()} ${secondGpu.model}`, "amd");
    });

    test("whitespaces should be ignored", () => {
      // Get a sample card
      const gpu = sampleData.rtx5090;

      // Assert the correct brand name is returned
      assertBrandName(`   ${gpu.manufacturer}   ${gpu.gpuline}   ${gpu.model}   `, "nvidia");
    });
  });

  describe("invalid brand or line names", () => {
    test("typos should return a default brand name", () => {
      // Get a sample card
      const gpu = sampleData.rtx5090;

      // Assert the default brand name is returned
      assertBrandName(`nvdia gforce ${gpu.model}`, "default");
    });

    test("empty manufacturer and line should return a default brand name", () => {
      // Get a sample card
      const gpu = sampleData.rtx5090;

      // Assert the default brand name is returned
      assertBrandName(`${gpu.model}`, "default");
    });

    test("non-existing manufacturer and lines should return a default brand name", () => {
      // Get a sample card
      const gpu = sampleData.rtx5090;

      // Assert the default brand name is returned
      assertBrandName(`brand line ${gpu.model}`, "default");
    });

    test("non-string values should return a default brand name", () => {
      // Get a sample card
      const gpu = sampleData.rtx5090;

      // Assert the default brand name are returned on each case
      assertBrandName(`${true} ${gpu.model}`, "default");
      assertBrandName(`${null} ${gpu.model}`, "default");
      assertBrandName(`${undefined} ${gpu.model}`, "default");
      assertBrandName(`${0} ${gpu.model}`, "default");
    });
  });
});
