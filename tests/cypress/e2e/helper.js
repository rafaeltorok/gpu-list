export function addGpu(gpu) {
  cy.contains("Add Graphics Card").click();

  // NOTE: Ensure the input is visible and enabled before typing
  // Cypress throws an error if you try to type into a disabled element, so we assert 'not.be.disabled' first
  cy.get("#manufacturer").should("be.visible").and("not.be.disabled");

  const fillInputField = (fieldName, data) => {
    cy.get(fieldName).type(data);
  };

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

  cy.get(".add-gpu-submit-button").click();
}

export function showGPUData(gpuName) {
  cy.contains(gpuName).closest("table").find("button").contains("Show").click();
}

export function checkRowData(rowName, data) {
  cy.get(".gpu-data-table tbody tr th")
    .contains(rowName)
    .then(() => {
      cy.get(".gpu-data-table tbody tr td").contains(data);
    });
}

export function indexSelector(itemName) {
  cy.get(".page-index-list li")
    .contains(itemName) // Select based on text
    .click();

  cy.get(".gpu-data-table").should("be.visible");

  cy.get(".gpu-data-table").should("contain", itemName);
}
