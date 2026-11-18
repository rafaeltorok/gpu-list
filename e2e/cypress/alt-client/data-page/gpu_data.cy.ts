// Utils
import calculatePerformance from "../../../../shared/utils/calculatePerformance";

// TypeScript types
import type { GpuInputType, GpuType } from "../../../../shared/types/types";

// Helper functions
function formatVramAmount(gpu: GpuType) {
  // Format the VRAM amount in either GB or MB
  return gpu.vram < 1 ? `${gpu.vram * 1000}MB` : `${gpu.vram}GB`;
}

describe("the Graphics Card data table", function () {
  beforeEach(function () {
    cy.setupDatabase();

    // Load the GPU list and add each item
    cy.fixture("gpus").then((gpuList) => {
      // Add a new card to the list
      const gpu = gpuList[0];
      cy.createGpu(gpu);

      // Reload the page to update the list
      cy.visit("/alt");
    });
  });

  describe("basic UI functionality", function () {
    it("clicking on a card should navigate to the details page", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Select a card from the list
        const gpu = gpuList[0];
        const performance = calculatePerformance(gpu);

        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpu.model}`)
          .click();

        // Check if all the card data is being displayed
        cy.get(".gpu-detail-header > h1")
          .contains(`${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`);

        // Specs
        cy.contains(".spec-label", /cores/i)
          .next()
          .should("have.text", `${gpu.cores}`);
        cy.contains(".spec-label", /tmus/i)
          .next()
          .should("have.text", `${gpu.tmus}`);
        cy.contains(".spec-label", /rops/i)
          .next()
          .should("have.text", `${gpu.rops}`);
        cy.contains(".spec-label", /vram/i)
          .next()
          .should("have.text", `${formatVramAmount(gpu)} ${gpu.memtype}`);
        cy.contains(".spec-label", /bus width/i)
          .next()
          .should("have.text", `${gpu.bus} bit`);

        // Clock speeds
        cy.contains(".spec-label", /base clock/i)
          .next()
          .should("have.text", `${gpu.baseclock} MHz`);
        cy.contains(".spec-label", /boost clock/i)
          .next()
          .should("have.text", `${gpu.boostclock} MHz`);
        cy.contains(".spec-label", /memory clock/i)
          .next()
          .should("have.text", `${gpu.memclock} Gbps effective`);

        // Performance
        cy.contains(".spec-label", /fp32/i)
          .next()
          .should("have.text", `${performance[0]}`);
        cy.contains(".spec-label", /texture rate/i)
          .next()
          .should("have.text", `${performance[1]}`);
        cy.contains(".spec-label", /pixel rate/i)
          .next()
          .should("have.text", `${performance[2]}`);
        cy.contains(".spec-label", /bandwidth/i)
          .next()
          .should("have.text", `${performance[3]}`);
      });
    });

    it("the theoretical performance is correct", function () {
      cy.fixture("gpus").then((gpuList: GpuInputType[]) => {
        // Select a card from the list
        const gpu = gpuList[0];

        // Get the performance data
        const performance = calculatePerformance(gpu);

        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpu.model}`)
          .click();

        // Confirm each row of the performance section is correct
        cy.contains(".spec-label", /fp32/i)
          .next()
          .should("have.text", `${performance[0]}`);
        cy.contains(".spec-label", /texture rate/i)
          .next()
          .should("have.text", `${performance[1]}`);
        cy.contains(".spec-label", /pixel rate/i)
          .next()
          .should("have.text", `${performance[2]}`);
        cy.contains(".spec-label", /bandwidth/i)
          .next()
          .should("have.text", `${performance[3]}`);
      });
    });

    it("a FP32 performance measured in TFLOPS is correctly displayed", function () {
      cy.fixture("gpus").then((gpuList: GpuInputType[]) => {
        // Select a card from the list
        const gpu = gpuList[0];

        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpu.model}`)
          .click();

        // Confirm the FP32 row contains the word TFLOPS
        cy.contains(".spec-label", /fp32/i)
          .next()
          .contains(/tflops/i);
      });
    });

    it("a FP32 performance measured in GFLOPS is correctly displayed", function () {
      cy.fixture("gpus").then((gpuList: GpuInputType[]) => {
        // Select a card from the list
        const gpu = gpuList[2];

        // Add the card to the list
        cy.createGpu(gpu);

        // Reload the page to update the list
        cy.visit("/alt");

        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpu.model}`)
          .click();

        // Confirm the FP32 row contains the word GFLOPS
        cy.contains(".spec-label", /fp32/i)
          .next()
          .contains(/gflops/i);
      });
    });

    it("cards with 4 IPC, have their FP32 performance correctly displayed", function () {
      cy.fixture("gpus").then((gpuList: GpuInputType[]) => {
        // Select a card from the list
        const rx9000Series = gpuList[4];
        const rx7000Series = gpuList[5];

        // Add each card to the list
        cy.createGpu(rx9000Series);
        cy.createGpu(rx7000Series);

        // Reload the page to update the list
        cy.visit("/alt");

        // Get the performance data for both
        const performanceRx9000 = calculatePerformance(rx9000Series);
        const performanceRx7000 = calculatePerformance(rx7000Series);

        // Confirm the FP32 performance for the Radeon RX 9000 Series is correct
        cy.get(".gpu-card-header")
          .contains(`${rx9000Series.model}`)
          .click();

        cy.contains(".spec-label", /fp32/i)
          .next()
          .should("have.text", `${performanceRx9000[0]}`);
        
        // Return to the main page
        cy.get(".back-button").click();

        // Confirm the FP32 performance for the Radeon RX 7000 Series is correct
        cy.get(".gpu-card-header")
          .contains(`${rx7000Series.model}`)
          .click();

        cy.contains(".spec-label", /fp32/i)
          .next()
          .should("have.text", `${performanceRx7000[0]}`);
      });
    });

    it("the amount of VRAM is correctly displayed as either GB or MB", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Gets a GPU with a VRAM amount measured in GB
        const gpuInGb = gpuList[0];
        // Gets a GPU with a VRAM amount measured in MB
        const gpuInMb = gpuList[8];

        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpuInGb.model}`)
          .click();

        // Confirm the VRAM amount is properly displayed
        cy.contains(".spec-label", /vram/i)
          .next()
          .should("have.text", `${gpuInGb.vram}GB ${gpuInGb.memtype}`);

        // Add a second GPU with a VRAM amount in MB
        cy.createGpu(gpuInMb);

        // Reload the page to update the list
        cy.visit("/alt");

        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpuInMb.model}`)
          .click();

        // Confirm the VRAM amount is properly displayed
        cy.contains(".spec-label", /vram/i)
          .next()
          .should("have.text", `${gpuInMb.vram  * 1000}MB ${gpuInMb.memtype}`);
      });
    });
  });

  describe("the delete button", function () {
    it("the GPU can be deleted", function () {
      cy.fixture("gpus").then((gpuList: GpuInputType[]) => {
        // Select a card from the list
        const gpu = gpuList[0];

        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpu.model}`)
          .click();

        // Remove the card and confirm it is not present anymore
        cy.get("#delete-button").click();

        // Confirm the removal within the dialog message
        cy.get(".dialog-buttons-wrapper > :nth-child(1)").click();

        // Assert the card is not present on the list anymore
        cy.get(".gpu-card-header")
          .should("not.exist");
      });
    });
  });

  describe("the edit button", function () {
    it("the specifications can be edited", function () {
      cy.fixture("gpus").then((gpuList: GpuInputType[]) => {
        // Select a card from the list
        const gpu = gpuList[0];

        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpu.model}`)
          .click();

        // Enter edit mode
        cy.get("#edit-button").click();

        // Edit the cores amount
        cy.get(".spec-label")
          .contains(/cores/i)
          .click();

        cy.focused().clear().type("3840");

        // Click on the confirm button
        cy.get("#confirm-button").click();

        // Assert the Cores row has the updated spec value
        cy.contains(".spec-label", /cores/i)
          .next()
          .should("have.text", "3840");
      });
    });

    it("modifying the specs fields should reflect on the theoretical performance", function () {
      cy.fixture("gpus").then((gpuList: GpuInputType[]) => {
        // Select a card from the list
        const gpu = gpuList[0];
        
        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpu.model}`)
          .click();

        // Enter edit mode
        cy.get("#edit-button").click();

        // Edit the specifications
        cy.get(".spec-label")
          .contains(/cores/i)
          .click();
        cy.focused().clear().type("3840");

        cy.get(".spec-label")
          .contains(/tmus/i)
          .click();
        cy.focused().clear().type("128");

        cy.get(".spec-label")
          .contains(/rops/i)
          .click();
        cy.focused().clear().type("64");

        cy.get(".spec-label")
          .contains(/bus width/i)
          .click();
        cy.focused().clear().type("256");

        // Click on the confirm button
        cy.get("#confirm-button").click();

        // Calculate the performance with the updated specs values
        const performance = calculatePerformance({
          ...gpu,
          cores: 3840,
          tmus: 128,
          rops: 64,
          bus: 256,
        });

        // Confirm each row of the performance section is correct
        cy.contains(".spec-label", /fp32/i)
          .next()
          .should("have.text", `${performance[0]}`);
        cy.contains(".spec-label", /texture rate/i)
          .next()
          .should("have.text", `${performance[1]}`);
        cy.contains(".spec-label", /pixel rate/i)
          .next()
          .should("have.text", `${performance[2]}`);
        cy.contains(".spec-label", /bandwidth/i)
          .next()
          .should("have.text", `${performance[3]}`);
      });
    });

    it("modifying the clock speeds fields should reflect on the theoretical performance", function () {
      cy.fixture("gpus").then((gpuList: GpuInputType[]) => {
        // Select a card from the list
        const gpu = gpuList[0];
        
        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpu.model}`)
          .click();

        // Enter edit mode
        cy.get("#edit-button").click();

        // Edit the clock speeds
        cy.get(".spec-label")
          .contains(/boost clock/i)
          .click();
        cy.focused().clear().type("2000");

        cy.get(".spec-label")
          .contains(/memory clock/i)
          .click();
        cy.focused().clear().type("18");

        // Click on the confirm button
        cy.get("#confirm-button").click();

        // Calculate the performance with the updated clock speed values
        const performance = calculatePerformance({
          ...gpu,
          boostclock: 2000,
          memclock: 18,
        });

        // Confirm each row of the performance section is correct
        cy.contains(".spec-label", /fp32/i)
          .next()
          .should("have.text", `${performance[0]}`);
        cy.contains(".spec-label", /texture rate/i)
          .next()
          .should("have.text", `${performance[1]}`);
        cy.contains(".spec-label", /pixel rate/i)
          .next()
          .should("have.text", `${performance[2]}`);
        cy.contains(".spec-label", /bandwidth/i)
          .next()
          .should("have.text", `${performance[3]}`);
      });
    });

    it("clicking on the Cancel button should cancel any changes", function () {
      cy.fixture("gpus").then((gpuList: GpuInputType[]) => {
        // Select a card from the list
        const gpu = gpuList[0];
        
        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpu.model}`)
          .click();

        // Enter edit mode
        cy.get("#edit-button").click();

        // Edit the specifications
        cy.get(".spec-label")
          .contains(/cores/i)
          .click();
        cy.focused().clear().type("3840");

        cy.get(".spec-label")
          .contains(/tmus/i)
          .click();
        cy.focused().clear().type("128");

        cy.get(".spec-label")
          .contains(/rops/i)
          .click();
        cy.focused().clear().type("64");

        // Click on the Cancel button
        cy.get("#cancel-button").click();

        // Confirm the specifications have not been changed
        cy.contains(".spec-label", /cores/i)
          .next()
          .should("have.text", `${gpu.cores}`);
        cy.contains(".spec-label", /tmus/i)
          .next()
          .should("have.text", `${gpu.tmus}`);
        cy.contains(".spec-label", /rops/i)
          .next()
          .should("have.text", `${gpu.rops}`);
      });
    });

    it("invalid specifications should not be accepted", function () {
      cy.fixture("gpus").then((gpuList: GpuInputType[]) => {
        // Select a card from the list
        const gpu = gpuList[0];

        // Navigate to the details page
        cy.get(".gpu-card-header")
          .contains(`${gpu.model}`)
          .click();

        // Enter edit mode
        cy.get("#edit-button").click();

        // Edit the specifications
        cy.get(".spec-label")
          .contains(/cores/i)
          .click();
        cy.focused().clear().type("0");

        // Click on the confirm button
        cy.get("#confirm-button").click();

        // Confirm there is a warning about the invalid data
        cy.get('[open=""] > .dialog-message').contains(
          /invalid gpu data/i,
        );
        cy.get('[open=""] > .dialog-button').click(); // Close the notification
      });
    });
  });
});
