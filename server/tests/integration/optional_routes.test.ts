// Node testing library dependencies
import { test, beforeEach, describe } from "node:test";
import assert from "node:assert";

// Requirements for running HTTP requests to the MongoDB server
import supertest from "supertest";
import GpuModel from "../../src/models/gpu.js";

// Importing the server itself plus the initial data
import app from "../../src/app.js";
import { gpuList } from "../data/data.js";

const api = supertest(app);

// Clear the database and add the testing data
beforeEach(async () => {
  await GpuModel.deleteMany({});
  for (const gpu of gpuList) {
    const gpuObject = new GpuModel(gpu);
    await api.post("/api/gpus").send(gpuObject.toJSON());
  }
});

describe("Testing the optional routes", () => {
  test("No VRAM route", async () => {
    // Get all cards from the novram route
    const getResponse = await api
      .get("/api/gpus/novram")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Select the first one
    const rtx3060 = getResponse.body[0];

    // Remove the fields that are not present on this route
    const { vram, memtype, ...otherFields } = gpuList[0];

    // Confirm the fields are not present on the response data
    assert.deepStrictEqual(rtx3060, { ...otherFields, id: rtx3060.id });
  });

  test("No Clock Speeds route", async () => {
    // Get all cards from the noclocks route
    const getResponse = await api
      .get("/api/gpus/noclocks")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Select the first one
    const rtx3060 = getResponse.body[0];

    // Remove the fields that are not present on this route
    const { baseclock, boostclock, memclock, ...otherFields } = gpuList[0];
    
    // Confirm the fields are not present on the response data
    assert.deepStrictEqual(rtx3060, { ...otherFields, id: rtx3060.id });
  });

  test("The GPU Calc route", async () => {
    // Assert the returned data matches the same pattern
    // from my GPUCalc (Java) and GPUCalcPy (Python) apps
    const getResponse = await api
      .get("/api/gpus/gpucalc")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Remove all fields that are not present on this route
    const { manufacturer, gpuline, ...otherFields } = gpuList[0];

    // Confirm the field is not present on the response data
    assert.deepStrictEqual(getResponse.body[0], otherFields);
  });
});
