// TypeScript types
import type { GpuInputType } from "../../../../shared/types/types";

// Add a new card through an HTTP POST request to the server
Cypress.Commands.add(
  "createGpu",
  (gpuObject: GpuInputType) => {
    return cy.request({
      url: `${Cypress.env("BACKEND")}/api/gpus`,
      method: "POST",
      body: {
        ...gpuObject
      },
    });
  },
);

// Add a small amount of cards for test data
Cypress.Commands.add(
  "addSampleData",
  () => {
    cy.fixture('gpus').then((gpuList) => {
      // Select the first 3 GPUs on the list for test data
      const firstGpu = gpuList[0];
      const secondGpu = gpuList[1];
      const thirdGpu = gpuList[2];

      // Add each one of them through the backend server
      cy.createGpu(firstGpu);
      cy.createGpu(secondGpu);
      cy.createGpu(thirdGpu);
    });
  }
);
