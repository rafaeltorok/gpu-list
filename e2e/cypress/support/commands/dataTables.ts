// TypeScript types
import type { GpuInputType } from "../../../../shared/types/types";

// Utils
import getFullModel from "../utils/getFullModel";

// Open a card data table to show all data
Cypress.Commands.add(
  "showData",
  (gpuName: string) => {
    cy.contains(gpuName).closest("table").find("button").contains("Show").click();
  }
);

// Check if the data on a row is correct
Cypress.Commands.add(
  "checkRowData",
  (rowName: string, data: string | number) => {
    cy.get(".gpu-data-table tbody tr th")
      .contains(rowName)
      .then(() => {
        cy.get(".gpu-data-table tbody tr td").contains(String(data));
      });
  }
);

// Expand the data table and confirm all specifications are correct
Cypress.Commands.add(
  "checkSpecs",
  (gpu: GpuInputType, index: number, vramSuffix: string) => {
    cy.get(".gpu-data-table")
      .eq(index)
      .then(($table) => {
        cy.wrap($table)
          .find("thead tr th")
          .should("contain", getFullModel(gpu));
        cy.wrap($table).find("button").contains("Show").click();
        cy.checkRowData("CORES", gpu.cores);
        cy.checkRowData("TMUs", gpu.tmus);
        cy.checkRowData("ROPs", gpu.rops);
        cy.checkRowData("VRAM", `${gpu.vram}${vramSuffix} ${gpu.memtype}`);
        cy.checkRowData("BUS WIDTH", `${gpu.bus} bit`);
        cy.checkRowData("BASE CLOCK", `${gpu.baseclock} MHz`);
        cy.checkRowData("BOOST CLOCK", `${gpu.boostclock} MHz`);
        cy.checkRowData("MEMORY CLOCK", `${gpu.memclock} Gbps effective`);
      });
    }
);
