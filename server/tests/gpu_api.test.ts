// Node testing library dependencies
import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";

// Requirements for running HTTP requests to the MongoDB server
import mongoose from "mongoose";
import supertest from "supertest";
import GpuModel from "../src/models/gpu.js";

// Importing the server itself plus the initial data
import app from "../src/app.js";
import { gpuList } from "./data.js";

const api = supertest(app);

// Stores the amount of objects stored on the initial data file
const initialDataLength: number = gpuList.length;

// Clear the database and add the testing data
beforeEach(async () => {
  await GpuModel.deleteMany({});
  for (const gpu of gpuList) {
    const gpuObject = new GpuModel(gpu);
    await api.post("/api/gpus").send(gpuObject.toJSON());
  }
});

describe("GET route", () => {
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
      id: rtx3060.body.id,
      manufacturer: "NVIDIA",
      gpuline: "GeForce",
      model: "RTX 3060",
      cores: 3584,
      tmus: 112,
      rops: 48,
      vram: 12,
      bus: 192,
      memtype: "GDDR6",
      baseclock: 1320,
      boostclock: 1777,
      memclock: 15,
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

describe("POST route", () => {
  test("A new GPU can be added", async () => {
    const gpuData = {
      manufacturer: "NVIDIA",
      gpuline: "GeForce",
      model: "RTX 4090",
      cores: 16384,
      tmus: 512,
      rops: 176,
      vram: 24,
      bus: 384,
      memtype: "GDDR6X",
      baseclock: 2235,
      boostclock: 2520,
      memclock: 21,
    };

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
    const gpuData = {
      manufacturer: "NVIDIA",
      gpuline: "",
      model: "RTX PRO 6000 Blackwell",
      cores: 24064,
      tmus: 752,
      rops: 192,
      vram: 96,
      bus: 512,
      memtype: "GDDR7",
      baseclock: 1590,
      boostclock: 2617,
      memclock: 28,
    };

    const postResponse = await api
      .post("/api/gpus")
      .send(gpuData)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.ok(postResponse.body.id, "id should be present");
    const { id, ...returnedObject } = postResponse.body;
    assert.deepStrictEqual(returnedObject, gpuData);

    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength + 1);
  });

  test("Invalid specifications", async () => {
    const gpuData = {
      manufacturer: "NVIDIA",
      gpuline: "GeForce",
      model: "RTX Invalid",
      cores: 0,
      tmus: -1,
      rops: "a",
      vram: 12,
      bus: 192,
      memtype: "GDDR7",
      baseclock: 1000,
      boostclock: 2000,
      memclock: 20,
    };

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
    const gpuData = {
      manufacturer: "NVIDIA",
      gpuline: "GeForce",
      model: "RTX Invalid",
      cores: 1024,
      tmus: 64,
      rops: 32,
      vram: 12,
      bus: 192,
      memtype: "GDDR7",
      baseclock: 0,
      boostclock: -1,
      memclock: "a",
    };

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
    const gpuData = {
      manufacturer: "NVIDIA",
      gpuline: "GeForce",
      model: "RTX Invalid",
      vram: 12,
      bus: 192,
      memtype: "GDDR7",
      baseclock: 1000,
      boostclock: 2000,
      memclock: 20,
    };

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
    const gpuData = {
      manufacturer: "",
      gpuline: "GeForce",
      model: "",
      cores: 1024,
      tmus: 32,
      rops: 16,
      vram: 12,
      bus: 192,
      memtype: "",
      baseclock: 1000,
      boostclock: 2000,
      memclock: 20,
    };

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
    const gpuData = {
      manufacturer: "NVIDIA",
      gpuline: "GeForce",
      model: "RTX 3060",
      cores: 3584,
      tmus: 112,
      rops: 48,
      vram: 12,
      bus: 192,
      memtype: "GDDR6",
      baseclock: 1320,
      boostclock: 1777,
      memclock: 15,
    };

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
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });
});

describe("DELETE route", () => {
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

    // Adds a GPU to be removed
    const postResponse = await api
      .post("/api/gpus")
      .send(gpuData)
      .expect(201)
      .expect("Content-type", /application\/json/);

    // Confirms the total amount of GPUs has been increased
    let getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength + 1);

    const id = postResponse.body.id;

    // Sends a delete request
    await api.delete(`/api/gpus/${id}`).expect(204);

    // Checks if the GPU has been removed from the server
    const removedGpu = await api.get(`/api/gpus/${id}`).expect(404);

    assert.strictEqual(removedGpu.body.error, "GPU not found");

    // Confirms the total amount has decreased
    getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });

  test("A non-existing id won't remove any cards", async () => {
    const deleteResponse = await api
      .delete("/api/gpus/0000a00a0a00aaa000000aa0")
      .expect(404);

    assert.strictEqual(deleteResponse.body.error, "GPU not found");

    // Confirms no cards have been removed
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });

  test("An invalid id returns a proper error message", async () => {
    const deleteResponse = await api.delete("/api/gpus/abc").expect(400);

    assert.strictEqual(deleteResponse.body.error, "Invalid ID format");

    // Confirms no cards have been removed
    const getResponse = await api.get("/api/gpus");
    assert.strictEqual(getResponse.body.length, initialDataLength);
  });
});

describe("PUT route", () => {
  test("A GPU can be updated", async () => {
    const getResponse = await api.get("/api/gpus").expect(200);

    // Fetches the GPU to be updated
    const rtx3060 = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Data to be updated
    const gpuData = {
      manufacturer: "NVIDIA",
      gpuline: "GeForce",
      model: "RTX 3060",
      cores: 3840,
      tmus: 128,
      rops: 64,
      vram: 16,
      bus: 256,
      memtype: "GDDR6",
      baseclock: 1320,
      boostclock: 1777,
      memclock: 15,
    };

    // Sends an update request to the server containing the above data
    const updatedGpu = await api
      .put(`/api/gpus/${rtx3060.body.id}`)
      .send(gpuData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Checks if the data has been correctly updated
    assert.deepStrictEqual(updatedGpu.body, {
      id: rtx3060.body.id,
      ...gpuData,
    });
  });

  test("Invalid specs returns a proper error message", async () => {
    const getResponse = await api.get("/api/gpus").expect(200);

    // Fetches the GPU before being updated
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

    // Sends update request with invalid data
    const putResponse = await api
      .put(`/api/gpus/${originalSpecs.body.id}`)
      .send(gpuData)
      .expect(400);

    // Checks if the error response messages exists for the invalid values
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

    // Fetches the GPU data to assure it hasn't been updated
    const rtx3060 = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200);

    assert.deepStrictEqual(rtx3060.body, originalSpecs.body);
  });

  test("Invalid data format", async () => {
    const getResponse = await api.get("/api/gpus").expect(200);

    // Fetches the GPU before being updated
    const originalSpecs = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Data to be updated
    const gpuData = {
      cores: "cores",
    };

    // Sends update request with invalid data
    const putResponse = await api
      .put(`/api/gpus/${originalSpecs.body.id}`)
      .send(gpuData)
      .expect(400);

    // Checks if the error response message contains the Mongoose cast error
    assert.strictEqual(putResponse.body.errors.cores, "Invalid Number");

    // Fetches the GPU data to assure it hasn't been updated
    const rtx3060 = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200);

    assert.deepStrictEqual(rtx3060.body, originalSpecs.body);
  });

  test("Sending an empty update request does not update any fields", async () => {
    const getResponse = await api.get("/api/gpus").expect(200);

    // Fetches the original specs form the database for the latter comparison
    const originalSpecs = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Sends an empty update request to the server
    const putResponse = await api
      .put(`/api/gpus/${originalSpecs.body.id}`)
      .expect(400);

    // Checks the error response message
    assert.strictEqual(putResponse.body.error, "No fields provided for update");

    // Fetches the GPU again
    const updatedGpu = await api
      .get(`/api/gpus/${getResponse.body[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Checks if the data remained the same
    assert.deepStrictEqual(updatedGpu.body, originalSpecs.body);
  });

  test("A non-existing id returns a proper error message", async () => {
    // Creates dummy data in order for the PUT request to work
    const gpuData = {
      cores: 1000,
    };

    const putResponse = await api
      .put("/api/gpus/0000a00a0a00aaa000000aa0")
      .send(gpuData)
      .expect(404);

    assert.strictEqual(putResponse.body.error, "GPU not found");
  });

  test("An invalid id returns a proper error message", async () => {
    // Creates dummy data in order for the PUT request to work
    const gpuData = {
      cores: 1000,
    };

    const putResponse = await api
      .put("/api/gpus/abc")
      .send(gpuData)
      .expect(400);

    assert.strictEqual(putResponse.body.error, "Invalid ID format");
  });
});

describe("Testing the optional routes", () => {
  test("No VRAM route", async () => {
    const getResponse = await api
      .get("/api/gpus/novram")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const rtx3060 = getResponse.body[0];

    const gpuData = {
      manufacturer: "NVIDIA",
      gpuline: "GeForce",
      model: "RTX 3060",
      cores: 3584,
      tmus: 112,
      rops: 48,
      bus: 192,
      baseclock: 1320,
      boostclock: 1777,
      memclock: 15,
    };

    assert.deepStrictEqual(rtx3060, { id: rtx3060.id, ...gpuData });
  });

  test("No Clock Speeds route", async () => {
    const getResponse = await api
      .get("/api/gpus/noclocks")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const rtx3060 = getResponse.body[0];

    const gpuData = {
      manufacturer: "NVIDIA",
      gpuline: "GeForce",
      model: "RTX 3060",
      cores: 3584,
      tmus: 112,
      rops: 48,
      vram: 12,
      bus: 192,
      memtype: "GDDR6",
    };

    assert.deepStrictEqual(rtx3060, { id: rtx3060.id, ...gpuData });
  });

  test("The GPU Calc route", async () => {
    // Asserts the returned data matches the same pattern
    // from my GPUCalc (Java) and GPUCalcPy (Python) apps
    const getResponse = await api
      .get("/api/gpus/gpucalc")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const { id: id, ...noIdData } = getResponse.body[0];

    const gpuData = {
      model: "RTX 3060",
      cores: 3584,
      tmus: 112,
      rops: 48,
      vram: 12,
      bus: 192,
      memtype: "GDDR6",
      baseclock: 1320,
      boostclock: 1777,
      memclock: 15,
    };

    assert.deepStrictEqual(noIdData, gpuData);
  });
});

after(async () => {
  await mongoose.connection.close();
});
