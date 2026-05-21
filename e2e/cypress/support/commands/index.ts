// Click on an index item
Cypress.Commands.add("indexSelector", (itemName: string) => {
  // Select based on text
  cy.get(".index-list li").contains(itemName).click();

  // Confirm the view has scrolled to a data table
  cy.get(".gpu-data-table").should("be.visible");

  // Confirm the correct card has been displayed
  cy.get(".gpu-data-table").should("contain", itemName);
});
