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
const initialDataLength: number = 0;

describe("POST route", { concurrency: false }, () => {
  // Clear the database and add the testing data
  beforeEach(async () => {
    await GpuModel.deleteMany({});
  });

  test("A new GPU can be added", async () => {
    // Get the first card from the list
    const gpuData = { ...gpuList[0] };

    // Create a new card
    const postResponse = await api
      .post("/api/gpus")
      .send(gpuData)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // Assert that the returned object has an id (auto-generated)
    assert.ok(postResponse.body.id, "id should be present");

    // Remove the id from the returned object
    const { id, ...returnedObject } = postResponse.body;

    // Compare all fields
    assert.deepStrictEqual(returnedObject, gpuData);

    // Check if the total document count has increased
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength + 1);
  });

  test("The GPU Line field is optional", async () => {
    // Get a card form the list that does not have a specific line
    const gpuData = { ...gpuList[4] };

    // Create a new card
    const postResponse = await api
      .post("/api/gpus")
      .send(gpuData)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // Assert that the returned object has an id (auto-generated)
    assert.ok(postResponse.body.id, "id should be present");

    // Remove the id from the returned object
    const { id, ...returnedObject } = postResponse.body;

    // Compare all fields
    assert.deepStrictEqual(returnedObject, gpuData);

    // Check if the total document count has increased
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength + 1);
  });

  test("Invalid specifications", async () => {
    // Add the invalid specifications
    const gpuData = {
      ...gpuList[0],
      cores: 0,
      tmus: -1,
      rops: "a",
    };

    // Try to create the new card
    const postResponse = await api.post("/api/gpus").send(gpuData).expect(400);

    // Checks if the error response messages exists for the invalid values
    assert.ok(postResponse.body.errors.cores);
    assert.ok(postResponse.body.errors.tmus);
    assert.ok(postResponse.body.errors.rops);

    // Checks if the number of objects on the database has not been increased
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });

  test("Invalid clock speeds", async () => {
    // Add the invalid clock speeds
    const gpuData = {
      ...gpuList[0],
      baseclock: 0,
      boostclock: -1,
      memclock: "a",
    };

    // Try to create the new card
    const postResponse = await api.post("/api/gpus").send(gpuData).expect(400);

    // Checks if the error response messages exists for the invalid values
    assert.ok(postResponse.body.errors.baseclock);
    assert.ok(postResponse.body.errors.boostclock);
    assert.ok(postResponse.body.errors.memclock);

    // Checks if the number of objects on the database has not been increased
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });

  test("Missing required fields", async () => {
    // Remove the cores, tmus and rops fields
    const { cores, tmus, rops, ...otherFields } = gpuList[0];
    const gpuData = otherFields;

    // Try to add the new card
    const postResponse = await api.post("/api/gpus").send(gpuData).expect(400);

    // Checks if the error response messages exists for the invalid values
    assert.ok(postResponse.body.errors.cores);
    assert.ok(postResponse.body.errors.tmus);
    assert.ok(postResponse.body.errors.rops);

    // Checks if the number of objects on the database has not been increased
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });

  test("Empty required fields", async () => {
    // Make all required string fields empty
    const gpuData = {
      ...gpuList[0],
      manufacturer: "",
      model: "",
      memtype: "",
    };

    // Try to add the new card
    const postResponse = await api.post("/api/gpus").send(gpuData).expect(400);

    // Checks if the error response messages exists for the invalid values
    assert.ok(postResponse.body.errors.manufacturer);
    assert.ok(postResponse.body.errors.model);
    assert.ok(postResponse.body.errors.memtype);

    // Checks if the number of objects on the database has not been increased
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });

  test("A duplicated graphics card will not be added", async () => {
    // Add a new card
    const gpuData = { ...gpuList[0] };
    await api
      .post("/api/gpus")
      .send(gpuData)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // Get the current total number of cards
    const currentDataLength = await api.get("/api/gpus");

    // Tries to add an already existing card to the database
    const postResponse = await api
      .post("/api/gpus")
      .send(gpuData)
      .expect(409)
      .expect("Content-Type", /application\/json/);

    // Assert that the response message properly warns the user of the issue
    assert.strictEqual(
      postResponse.body.error,
      "The graphics card has already been added to the list",
    );

    // Check if the total document count remained the same
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, currentDataLength.body.length);
  });
});