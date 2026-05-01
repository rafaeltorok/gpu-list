// Utils
import calculatePerformance from "../../../../shared/utils/calculatePerformance";
import getFullModel from "../../support/utils/getFullModel";

// TypeScript types
import type { GpuInputType } from "../../../../shared/types/types";

describe("testing the GPU data table", function () {
  beforeEach(function () {
    cy.setupDatabase();

    // Load the GPU list and add each item
    cy.fixture('gpus').then((gpuList) => {
      // Add a new card to the list
      const gpu = gpuList[0];
      cy.createGpu(gpu);

      // Reload the page to update the list
      cy.visit('/');
    });
  });

  it("the show button displays all specifications for a card", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Select a card form the list
      const gpu = gpuList[0];

      // Click on the Show button
      cy.showData(gpu);

      // Check if all the card data is being displayed
      cy.checkSpecs(gpu, "GB")
    });
  });

  it("the theoretical performance is correct", function () {
    cy.fixture('gpus').then((gpuList: GpuInputType[]) => {
      // Select a card from the list
      const gpu = gpuList[0];

      // Get the performance data
      const performance = calculatePerformance(gpu);

      // Open the card information table to display all data
      cy.showData(gpu);

      // Confirm each row of the performance section is correct
      cy.checkRowData(gpu, "FP32(float)", `${performance[0]}`);
      cy.checkRowData(gpu, "TEXTURE RATE", `${performance[1]}`);
      cy.checkRowData(gpu, "PIXEL RATE", `${performance[2]}`);
      cy.checkRowData(gpu, "BANDWIDTH", `${performance[3]}`);
    });
  });

  it("a FP32 performance measured in TFLOPS is correctly displayed", function () {
    cy.fixture('gpus').then((gpuList: GpuInputType[]) => {
      // Select a card from the list
      const gpu = gpuList[0];

      // Open a card's information table to display all data
      cy.showData(gpu);

      // Confirm the FP32 row contains the word TFLOPS
      cy.checkRowData(gpu, "FP32(float)", `TFLOPS`);
    });
  });

  it("a FP32 performance measured in GFLOPS is correctly displayed", function () {
    cy.fixture('gpus').then((gpuList: GpuInputType[]) => {
      // Select a card from the list
      const gpu = gpuList[2];

      // Add the card to the list
      cy.request("POST", "/api/gpus", gpu);

      // Reload the page to update the list
      cy.visit("/");

      // Open a card's information table to display all data
      cy.showData(gpu);

      // Confirm the FP32 row contains the word GFLOPS
      cy.checkRowData(gpu, "FP32(float)", `GFLOPS`);
    });
  });

  it("cards with 4 IPC, have their FP32 performance correctly displayed", function () {
    cy.fixture('gpus').then((gpuList: GpuInputType[]) => {
      // Select a card from the list
      const rx9000Series = gpuList[4];
      const rx7000Series = gpuList[5];

      // Add each card to the list
      cy.request("POST", "/api/gpus", rx9000Series);
      cy.request("POST", "/api/gpus", rx7000Series);
      
      // Reload the page to update the list
      cy.visit("/");

      // Get the performance data for both
      const performanceRx9000 = calculatePerformance(rx9000Series);
      const performanceRx7000 = calculatePerformance(rx7000Series);

      // Confirm the FP32 performance for the Radeon RX 9000 Series is correct
      cy.showData(rx9000Series);
      cy.checkRowData(rx9000Series, "FP32(float)", `${performanceRx9000[0]}`);

      // Confirm the FP32 performance for the Radeon RX 7000 Series is correct
      cy.showData(rx7000Series);
      cy.checkRowData(rx7000Series, "FP32(float)", `${performanceRx7000[0]}`);
    });
  });

  it("the GPU can be deleted", function () {
    cy.fixture('gpus').then((gpuList: GpuInputType[]) => {
      // Select a card from the list
      const gpu = gpuList[0];

      // Open a card's information table to display all data
      cy.showData(gpu);
      
      // Remove the card and confirm it is not present anymore
      cy.get(".gpu-data-table tfoot #delete-gpu-button").click();
      cy.get(".gpu-data-table").should("not.exist");
    });
  });

  it("the amount of VRAM is correctly displayed as either GB or MB", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Gets a GPU with a VRAM amount measured in GB
      const gpuInGb = gpuList[0];
      // Gets a GPU with a VRAM amount measured in MB
      const gpuInMb = gpuList[8];

      // Confirm the first model exists
      cy.get(".gpu-data-table thead tr th").should(
        "contain",
        getFullModel(gpuInGb),
      );

      // Open a card's information table to display all data
      cy.showData(gpuInGb);

      // Confirm the VRAM amount is properly displayed
      cy.checkRowData(gpuInGb, "VRAM", `${gpuInGb.vram}GB ${gpuInGb.memtype}`);

      // Add a second GPU with a VRAM amount in MB
      cy.request("POST", "/api/gpus", gpuInMb);
      
      // Reload the page to update the list
      cy.visit("/");

      // Confirm the second model exists
      cy.get(".gpu-data-table thead tr th").should(
        "contain",
        getFullModel(gpuInMb),
      );

      // Open a card's information table to display all data
      cy.showData(gpuInMb);

      // Convert the VRAM amount to MB and confirm it is properly displayed
      cy.checkRowData(gpuInMb, "VRAM", `${(gpuInMb.vram * 1000)}MB ${gpuInMb.memtype}`);
    });
  });
});