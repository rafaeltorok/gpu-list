// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// Creates a new GPU object
Cypress.Commands.add(
  "createGpu",
  ({
    manufacturer,
    gpuline,
    model,
    cores,
    tmus,
    rops,
    vram,
    bus,
    memtype,
    baseclock,
    boostclock,
    memclock,
  }) => {
    cy.request({
      url: "http://localhost:3001/api/gpus",
      method: "POST",
      body: {
        manufacturer,
        gpuline,
        model,
        cores,
        tmus,
        rops,
        vram,
        bus,
        memtype,
        baseclock,
        boostclock,
        memclock,
      },
    });

    cy.visit("http://localhost:5173");
  },
);
