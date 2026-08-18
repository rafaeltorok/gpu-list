// TypeScript types
import type { GpuInputType } from "../../../../shared/types/types";

// Utils
import getFullModel from "../utils/getFullModel";

// Open a card data table to show all data
Cypress.Commands.add("showData", (gpu: GpuInputType) => {
  const fullModelName = getFullModel(gpu);
  cy.contains(".gpu-data-table", fullModelName)
    .closest("table")
    .find("button")
    .contains("Show")
    .click();
});

// Check if the data on a row is correct
Cypress.Commands.add(
  "checkRowData",
  (gpu: GpuInputType, rowName: string, data: string | number) => {
    const fullModelName = getFullModel(gpu);

    cy.contains(".gpu-data-table", fullModelName)
      .closest("table")
      .within(() => {
        // Find the row and confirm the data is correctly being displayed
        cy.contains("tr", rowName).within(() => {
          cy.get("td").contains(String(data));
        });
      });
  },
);

// Expand the data table and confirm all specifications are correct
Cypress.Commands.add("checkSpecs", (gpu: GpuInputType, vramSuffix: string) => {
  // Open the respective data table and check all specifications
  cy.checkRowData(gpu, "CORES", gpu.cores);
  cy.checkRowData(gpu, "TMUs", gpu.tmus);
  cy.checkRowData(gpu, "ROPs", gpu.rops);
  cy.checkRowData(gpu, "VRAM", `${gpu.vram}${vramSuffix} ${gpu.memtype}`);
  cy.checkRowData(gpu, "BUS WIDTH", `${gpu.bus} bit`);
  cy.checkRowData(gpu, "BASE CLOCK", `${gpu.baseclock} MHz`);
  cy.checkRowData(gpu, "BOOST CLOCK", `${gpu.boostclock} MHz`);
  cy.checkRowData(gpu, "MEMORY CLOCK", `${gpu.memclock} Gbps effective`);
});

// Edit a spec field from the table in edit mode
Cypress.Commands.add("editSpecField", (fieldName: string, fullModelName: string, value: string) => {
  cy.contains(".gpu-data-table", fullModelName)
    .closest("table")
    .within(() => {
      // Find the row and confirm the data is correctly being displayed
      cy.contains("tr", fieldName).within(() => {
        // Select all forces the default 0 value to be replaced
        cy.get("td").get("input[type='number']").clear().type(`{selectall}${value}`);
      });
    });
});
