// Clear all objects from the database
Cypress.Commands.add("setupDatabase", () => {
  // Print the MongoDB URL on the console to confirm which database is being used for the tests
  cy.log("Backend:", Cypress.env("BACKEND"));

  // Clear all previous data from the database
  return cy.request("POST", `${Cypress.env("BACKEND")}/api/testing/reset`);
});
