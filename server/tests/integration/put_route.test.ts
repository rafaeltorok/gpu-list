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

describe("PUT route", { concurrency: false }, () => {
  // Clear the database and add the testing data
  beforeEach(async () => {
    await GpuModel.deleteMany({});
    for (const gpu of gpuList) {
      const gpuObject = new GpuModel(gpu);
      await api.post("/api/gpus").send(gpuObject.toJSON());
    }
  });

  test("A card can be updated", async () => {
    const getResponse = await api.get("/api/gpus").expect(200);

    // Fetch the card to be updated
    const rtx3060 = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Remove the id field
    const { id, ...otherFields } = rtx3060.body;

    // Data to be updated
    const gpuData = {
      ...otherFields,
      cores: 3840,
      tmus: 128,
      rops: 64,
      vram: 16,
      bus: 256,
    };

    // Send the updated data
    const updatedGpu = await api
      .put(`/api/gpus/${rtx3060.body.id}`)
      .send(gpuData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Check if the data has been correctly updated
    assert.deepStrictEqual(updatedGpu.body, {
      ...gpuData,
      id: rtx3060.body.id,
    });
  });

  test("Invalid specs returns a proper error message", async () => {
    const getResponse = await api.get("/api/gpus").expect(200);

    // Fetch the original specs from the database for the latter comparison
    const originalSpecs = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Data to be updated
    const gpuData = {
      cores: 0,
      tmus: -1,
      rops: 0,
    };

    // Send an update request with invalid data
    const putResponse = await api
      .put(`/api/gpus/${originalSpecs.body.id}`)
      .send(gpuData)
      .expect(400);

    // Check if the error response messages exists for the invalid values
    assert.notStrictEqual(
      putResponse.body.errors.cores,
      undefined,
      "Data should be defined",
    );
    assert.notStrictEqual(
      putResponse.body.errors.tmus,
      undefined,
      "Data should be defined",
    );
    assert.notStrictEqual(
      putResponse.body.errors.rops,
      undefined,
      "Data should be defined",
    );

    // Fetch the original card data to make sure it hasn't been updated
    const rtx3060 = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200);
    assert.deepStrictEqual(rtx3060.body, originalSpecs.body);
  });

  test("Invalid data format", async () => {
    const getResponse = await api.get("/api/gpus").expect(200);

    // Fetch the original specs from the database for the latter comparison
    const originalSpecs = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Data to be updated
    const gpuData = {
      cores: "cores",
    };

    // Send an update request with invalid data
    const putResponse = await api
      .put(`/api/gpus/${originalSpecs.body.id}`)
      .send(gpuData)
      .expect(400);

    // Check if the error response message contains the Mongoose cast error
    assert.strictEqual(putResponse.body.errors.cores, "Invalid Number");

    // Fetch the card data to make sure it hasn't been updated
    const rtx3060 = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200);
    assert.deepStrictEqual(rtx3060.body, originalSpecs.body);
  });

  test("Sending an empty update request does not update any fields", async () => {
    const getResponse = await api.get("/api/gpus").expect(200);

    // Fetch the original specs from the database for the latter comparison
    const originalSpecs = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Send an empty update request to the server
    const putResponse = await api
      .put(`/api/gpus/${originalSpecs.body.id}`)
      .expect(400);

    // Check the error response message
    assert.strictEqual(putResponse.body.error, "No fields provided for update");

    // Fetch the card again to check if the data remained the same
    const updatedGpu = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.deepStrictEqual(updatedGpu.body, originalSpecs.body);
  });

  test("A non-existing id returns a proper error message", async () => {
    // Create a dummy data in order for the PUT request to work
    const gpuData = {
      cores: 1000,
    };

    // Send the updated request with a non-existing id
    const putResponse = await api
      .put("/api/gpus/0000a00a0a00aaa000000aa0")
      .send(gpuData)
      .expect(404);

    // Check if an error message is properly returned
    assert.strictEqual(putResponse.body.error, "GPU not found");
  });

  test("An invalid id returns a proper error message", async () => {
    // Create a dummy data in order for the PUT request to work
    const gpuData = {
      cores: 1000,
    };

    // Send the updated request with a non-existing id
    const putResponse = await api
      .put("/api/gpus/abc")
      .send(gpuData)
      .expect(400);

    // Check if an error message is properly returned
    assert.strictEqual(putResponse.body.error, "Invalid ID format");
  });
});
