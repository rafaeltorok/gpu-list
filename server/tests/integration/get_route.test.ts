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

describe("GET route", { concurrency: false }, () => {
  // Clear the database and add the testing data
  beforeEach(async () => {
    await GpuModel.deleteMany({});
    for (const gpu of gpuList) {
      const gpuObject = new GpuModel(gpu);
      await api.post("/api/gpus").send(gpuObject.toJSON());
    }
  });

  test("GPUs are returned as JSON", async () => {
    await api
      .get("/api/gpus")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("All GPUs are returned", async () => {
    const response = await api.get("/api/gpus");
    assert.strictEqual(response.body.length, initialDataLength);
  });

  test("Returning a GPU by its id", async () => {
    const getResponse = await api.get("/api/gpus");
    const rtx3060 = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const gpuData = {
      ...gpuList[0],
      id: rtx3060.body.id,
    };

    assert.deepStrictEqual(rtx3060.body, gpuData);
  });

  test("A non-existing id returns a proper error message", async () => {
    const getResponse = await api
      .get("/api/gpus/0000a00a0a00aaa000000aa0")
      .expect(404);

    assert.strictEqual(getResponse.body.error, "GPU not found");
  });

  test("An invalid id returns a proper error message", async () => {
    const getResponse = await api.get("/api/gpus/abc").expect(400);

    assert.strictEqual(getResponse.body.error, "Invalid ID format");
  });
});
