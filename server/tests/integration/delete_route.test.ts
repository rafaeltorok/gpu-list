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

// Store the initial amount of objects
const initialDataLength: number = gpuList.length;

describe("DELETE route", { concurrency: false }, () => {
  // Clear the database and add the testing data
  beforeEach(async () => {
    await GpuModel.deleteMany({});
    for (const gpu of gpuList) {
      const gpuObject = new GpuModel(gpu);
      await api.post("/api/gpus").send(gpuObject.toJSON());
    }
  });

  test("A GPU can be deleted", async () => {
    const gpuData = {
      manufacturer: "AMD",
      gpuline: "Radeon",
      model: "RX 6700 XT",
      cores: 2560,
      tmus: 160,
      rops: 64,
      vram: 12,
      bus: 192,
      memtype: "GDDR6",
      baseclock: 2321,
      boostclock: 2581,
      memclock: 16,
    };

    // Add the card to be removed
    const postResponse = await api
      .post("/api/gpus")
      .send(gpuData)
      .expect(201)
      .expect("Content-type", /application\/json/);

    // Confirm the total amount of cards has been increased
    let getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength + 1);

    // Get the ID value for the newly created card
    const id = postResponse.body.id;

    // Send a delete request
    await api.delete(`/api/gpus/${id}`).expect(204);

    // Check if the GPU has been removed from the server
    const removedGpu = await api.get(`/api/gpus/${id}`).expect(404);
    assert.strictEqual(removedGpu.body.error, "GPU not found");

    // Confirm the total amount has decreased
    getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });

  test("A non-existing id won't remove any cards", async () => {
    const deleteResponse = await api
      .delete("/api/gpus/0000a00a0a00aaa000000aa0")
      .expect(404);

    // Confirm an error message is properly returned
    assert.strictEqual(deleteResponse.body.error, "GPU not found");

    // Confirm no cards have been removed
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });

  test("An invalid id returns a proper error message", async () => {
    const deleteResponse = await api.delete("/api/gpus/abc").expect(400);

    // Confirm an error message is properly returned
    assert.strictEqual(deleteResponse.body.error, "Invalid ID format");

    // Confirms no cards have been removed
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });
});
