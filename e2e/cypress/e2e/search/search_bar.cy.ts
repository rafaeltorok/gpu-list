// E2E tests
describe("testing the search bar", function () {
  beforeEach(function () {
    cy.fixture('gpus').then((gpuList) => {
      cy.setupDatabase();

      // Add all available cards on the list to test with multiple manufacturers
      for (const gpu of gpuList) {
        cy.createGpu(gpu);
      }

      // Access the main page
      cy.visit("/");
    });
  });

  it("the search bar can be displayed", function () {
    // Click on the button to open the search bar
    cy.get("#search-bar-field").find("button").contains("Search").click();

    // Confirm it has been opened
    cy.get("#search-bar-field").find("button").should("contain", "Cancel");
  });

  it("searching for specific manufacturers only", function () {
    // Click on the button to open the search bar
    cy.get("#search-bar-field").find("button").contains("Search").click();

    // Searches for NVIDIA cards
    cy.get("#search-bar-input").type("nvidia");

    // Confirm the correct number of cards have been found
    cy.get(".gpu-data-table").should("have.length", 5);

    // NOTE: We query each '.gpu-data-table' fresh with cy.get() instead of using a stored $table from .then()
    // This avoids Cypress errors caused by React re-rendering the DOM and detaching the previous element snapshot.
    // If we used a $table snapshot and then called .find() on it, Cypress would throw:
    // "cy.find() failed because the page updated as a result of this command, but the subject is no longer attached to the DOM."
    cy.get(".gpu-data-table")
      .eq(0)
      .find("thead tr th")
      .should("contain", "NVIDIA GeForce RTX 3060");
    cy.get(".gpu-data-table")
      .eq(1)
      .find("thead tr th")
      .should("contain", "NVIDIA GeForce GTX 970");
    cy.get(".gpu-data-table")
      .eq(2)
      .find("thead tr th")
      .should("contain", "NVIDIA GeForce GTX 650");
    cy.get(".gpu-data-table")
      .eq(3)
      .find("thead tr th")
      .should("contain", "NVIDIA RTX PRO 6000 Blackwell");
    cy.get(".gpu-data-table")
      .eq(4)
      .find("thead tr th")
      .should("contain", "NVIDIA GeForce GT 210");

    // Searches for AMD Radeon cards
    cy.get("#search-bar-input").clear().type("amd");

    // Confirm the correct number of cards have been found
    cy.get(".gpu-data-table").should("have.length", 2);

    // Confirm the models are correct
    cy.get(".gpu-data-table")
      .eq(0)
      .find("thead tr th")
      .should("contain", "AMD Radeon RX 9070 XT");
    cy.get(".gpu-data-table")
      .eq(1)
      .find("thead tr th")
      .should("contain", "AMD Radeon RX 7900 XTX");

    // Searches for Intel Arc cards
    cy.get("#search-bar-input").clear().type("intel");

    // Confirm the correct number of cards have been found
    cy.get(".gpu-data-table").should("have.length", 2);

    // Confirm the models are correct
    cy.get(".gpu-data-table")
      .eq(0)
      .find("thead tr th")
      .should("contain", "Intel Arc B580");
    cy.get(".gpu-data-table")
      .eq(1)
      .find("thead tr th")
      .should("contain", "Intel Arc A770");
  });

  it("filtering the desired graphics card line", function () {
    // Click on the button to open the search bar
    cy.get("#search-bar-field").find("button").contains("Search").click();

    // Searches for NVIDIA GeForce cards
    cy.get("#search-bar-input").type("geforce");

    // Confirm the correct number of cards have been found
    cy.get(".gpu-data-table").should("have.length", 4);

    // Confirm the models are correct
    cy.get(".gpu-data-table")
      .eq(0)
      .find("thead tr th")
      .should("contain", "NVIDIA GeForce RTX 3060");
    cy.get(".gpu-data-table")
      .eq(1)
      .find("thead tr th")
      .should("contain", "NVIDIA GeForce GTX 970");
    cy.get(".gpu-data-table")
      .eq(2)
      .find("thead tr th")
      .should("contain", "NVIDIA GeForce GTX 650");
    cy.get(".gpu-data-table")
      .eq(3)
      .find("thead tr th")
      .should("contain", "NVIDIA GeForce GT 210");

    // Searches for AMD Radeon cards
    cy.get("#search-bar-input").clear().type("radeon");

    // Confirm the correct number of cards have been found
    cy.get(".gpu-data-table").should("have.length", 2);

    // Confirm the models are correct
    cy.get(".gpu-data-table")
      .eq(0)
      .find("thead tr th")
      .should("contain", "AMD Radeon RX 9070 XT");
    cy.get(".gpu-data-table")
      .eq(1)
      .find("thead tr th")
      .should("contain", "AMD Radeon RX 7900 XTX");

    // Searches for Intel Arc cards
    cy.get("#search-bar-input").clear().type("arc");

    // Confirm the correct number of cards have been found
    cy.get(".gpu-data-table").should("have.length", 2);

    // Confirm the models are correct
    cy.get(".gpu-data-table")
      .eq(0)
      .find("thead tr th")
      .should("contain", "Intel Arc B580");
    cy.get(".gpu-data-table")
      .eq(1)
      .find("thead tr th")
      .should("contain", "Intel Arc A770");
  });

  it("filtering the cards by the secondary line", function () {
    // Confirm the correct number of cards have been found
    cy.get("#search-bar-field").find("button").contains("Search").click();

    // Search for the secondary line
    cy.get("#search-bar-input").type("rtx");

    // Confirm the correct number of cards have been found
    cy.get(".gpu-data-table").should("have.length", 2);

    // Confirm the models are correct
    cy.get(".gpu-data-table")
      .eq(0)
      .find("thead tr th")
      .should("contain", "NVIDIA GeForce RTX 3060");
    cy.get(".gpu-data-table")
      .eq(1)
      .find("thead tr th")
      .should("contain", "NVIDIA RTX PRO 6000 Blackwell");
  });

  it("filtering by specific model variations or names", function () {
    // Searches by XTX variants only
    cy.get("#search-bar-field").find("button").contains("Search").click();

    cy.get("#search-bar-input").type("xtx");

    // Confirm the correct number of cards have been found
    cy.get(".gpu-data-table").should("have.length", 1);

    // Confirm the models are correct
    cy.get(".gpu-data-table")
      .eq(0)
      .find("thead tr th")
      .should("contain", "AMD Radeon RX 7900 XTX");

    // Search by cards that contain a model name with '70'
    cy.get("#search-bar-input").clear().type("70");

    // Confirm the correct number of cards have been found
    cy.get(".gpu-data-table").should("have.length", 3);

    // Confirm the models are correct
    cy.get(".gpu-data-table")
      .eq(0)
      .find("thead tr th")
      .should("contain", "NVIDIA GeForce GTX 970");
    cy.get(".gpu-data-table")
      .eq(1)
      .find("thead tr th")
      .should("contain", "AMD Radeon RX 9070 XT");
    cy.get(".gpu-data-table")
      .eq(2)
      .find("thead tr th")
      .should("contain", "Intel Arc A770");
  });

  it("the index is also filtered by the search results", function () {
    // Click on the button to open the search bar
    cy.get("#search-bar-field").find("button").contains("Search").click();

    // Search by the GPU line
    cy.get("#search-bar-input").type("GeForce");

    // Open the index
    cy.get("#page-index")
      .find("#show-index-button")
      .contains("Show index")
      .click();

    // Confirm only the filtered cards appear on the index list
    cy.get(".page-index-list li").eq(0).contains("NVIDIA GeForce RTX 3060");
    cy.get(".page-index-list li").eq(1).contains("NVIDIA GeForce GTX 970");
    cy.get(".page-index-list li").eq(2).contains("NVIDIA GeForce GTX 650");
    cy.get(".page-index-list li").eq(3).contains("NVIDIA GeForce GT 210");
  });
});
