// TypeScript types
import type { GpuInputType } from "../../../../shared/types/types";

// Fill the add new graphics card form
Cypress.Commands.add("fillAddForm", (gpu: GpuInputType) => {
  // Open the add form
  cy.contains("Add Graphics Card").click();

  // NOTE: Ensure the input is visible and enabled before typing
  // Cypress throws an error if you try to type into a disabled element, so we assert 'not.be.disabled' first
  cy.get("#manufacturer").should("be.visible").and("not.be.disabled");

  // Helper function to fill each field
  const fillInputField = (fieldName: string, data: string | number) => {
    cy.get(fieldName).type(String(data));
  };

  // Fill each input on the form
  fillInputField("#manufacturer", gpu.manufacturer);
  fillInputField("#gpuline", gpu.gpuline);
  fillInputField("#model", gpu.model);
  fillInputField("#cores", gpu.cores);
  fillInputField("#tmus", gpu.tmus);
  fillInputField("#rops", gpu.rops);
  fillInputField("#vram", gpu.vram);
  fillInputField("#bus", gpu.bus);
  fillInputField("#memtype", gpu.memtype);
  fillInputField("#baseclock", gpu.baseclock);
  fillInputField("#boostclock", gpu.boostclock);
  fillInputField("#memclock", gpu.memclock);
});
