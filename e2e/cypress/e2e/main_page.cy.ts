// Utils
import calculatePerformance from "../../../shared/utils/calculatePerformance";
import getFullModel from "../support/utils/getFullModel";

// TypeScript types
import type { GpuInputType } from "../../../shared/types/types";

// E2E tests
describe("Testing the GPU list", function () {
  beforeEach(function () {
    cy.setupDatabase();

    // Access the main page
    cy.visit("/");
  });

  describe("Basic page access", function () {
    it("main page can be opened", function () {
      cy.contains("GPU List");
    });
  });

  describe("testing the GPU data table", function () {
    beforeEach(function () {
      cy.fixture('gpus').then((gpuList) => {
        // Add a new card to the list
        const gpu = gpuList[0];
        cy.createGpu(gpu);

        // Access the main page
        cy.visit('/');
      });
    });

    it("all GPU specifications are displayed when clicking the show button", function () {
      cy.fixture('gpus').then((gpuList) => {
        // Select a card form the list
        const gpu = gpuList[0];

        // Confirm the correct data table is being shown
        cy.get(".gpu-data-table thead tr th").should(
          "contain",
          getFullModel(gpu),
        );

        // Check all specifications rows
        cy.checkSpecs(gpu, 0, "GB")
      });
    });

    it("the theoretical performance is correct", function () {
      cy.fixture('gpus').then((gpuList: GpuInputType[]) => {
        // Select a card form the list
        const gpu = gpuList[0];

        // Get the performance data
        const performance = calculatePerformance(gpu);

        // Open a card's information table to display all data
        cy.showData(getFullModel(gpu));

        // Confirm each row of the performance section is correct
        cy.checkRowData("FP32(float)", `${performance[0]}`);
        cy.checkRowData("TEXTURE RATE", `${performance[1]}`);
        cy.checkRowData("PIXEL RATE", `${performance[2]}`);
        cy.checkRowData("BANDWIDTH", `${performance[3]}`);
      });
    });

    it("the GPU can be deleted", function () {
      cy.fixture('gpus').then((gpuList: GpuInputType[]) => {
        // Select a card form the list
        const gpu = gpuList[0];

        // Open a card's information table to display all data
        cy.showData(getFullModel(gpu));
        
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
        cy.showData(getFullModel(gpuInGb));

        // Confirm the VRAM amount is properly displayed
        cy.checkRowData("VRAM", `${gpuInGb.vram}GB ${gpuInGb.memtype}`);

        // Add a second GPU with a VRAM amount in MB
        cy.request("POST", "/api/gpus", gpuInMb);
        
        // Access the main page
        cy.visit("/");

        // Confirm the second model exists
        cy.get(".gpu-data-table thead tr th").should(
          "contain",
          getFullModel(gpuInMb),
        );

        // Open a card's information table to display all data
        cy.showData(getFullModel(gpuInMb));

        // Convert the VRAM amount to MB and confirm it is properly displayed
        cy.checkRowData("VRAM", `${(gpuInMb.vram * 1000)}MB ${gpuInMb.memtype}`);
      });
    });
  });

  describe("the show all data button works", function () {
    beforeEach(function () {
      // Add a small amount of data to test
      cy.addSampleData();

      // Access the main page
      cy.visit("/");
    });

    it("it expands all tables on the page", function () {
      cy.fixture('gpus').then((gpuList) => {
        // Select the first 3 cards of the list
        const firstGpu = gpuList[0];
        const secondGpu = gpuList[1];
        const thirdGpu = gpuList[2];

        // Confirm each one of the tables, contains the correct specifications
        cy.checkSpecs(firstGpu, 0, "GB");
        cy.checkSpecs(secondGpu, 1, "GB");
        cy.checkSpecs(thirdGpu,  2,"GB");
      });
    });
  });
});
