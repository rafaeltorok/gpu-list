// E2E tests
describe("Testing the GPU list", function () {
  beforeEach(function () {
    cy.setupDatabase();

    // Access the main page
    cy.visit("/");
  });

  describe("Basic page access", function () {
    it("main page can be opened", function () {
      cy.contains("GPU List");
    });
  });

  describe("the show all data button", function () {
    beforeEach(function () {
      // Add a small amount of data to test
      cy.addSampleData();

      // Access the main page
      cy.visit("/");
    });

    it("it expands all tables on the page", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Select the first 3 cards of the list
        const firstGpu = gpuList[0];
        const secondGpu = gpuList[1];
        const thirdGpu = gpuList[2];

        // Click on the Show All Data button
        cy.get("button").contains("Show all data").click();

        // Confirm each one of the tables, contains the correct specifications
        cy.checkSpecs(firstGpu, "GB");
        cy.checkSpecs(secondGpu, "GB");
        cy.checkSpecs(thirdGpu, "GB");
      });
    });
  });

  describe("the cards per page selector", function () {
    beforeEach(function () {
      cy.fixture("gpus").then((gpuList) => {
        cy.setupDatabase();

        // Add all available cards to the list
        for (const gpu of gpuList) {
          cy.createGpu(gpu);
        }

        // Access the main page
        cy.visit("/");
      });
    });

    it("the select element works", function () {
      // Select an option
      cy.get("#limit-options")
        .select("3")
        .should("have.value", "3");

      // Confirm it is the currently selected one
      cy.get("#limit-options").invoke("val").should("eq", "3");
    });

    it("it correctly paginates the data based on the selected value", function () {
      // Select an option
      cy.get("#limit-options").select("3");

      // Confirm the correct number of cards are being shown
      cy.get(".gpu-data-table").should("have.length", 3);
    });
  });

  describe("the cards available counter", function () {
    it("the cards counter should display the correct amount of cards", function () {
      // Add a small amount of data to test
      cy.addSampleData();

      // Reload the page
      cy.visit("/");

      // Assert the cards available counter is correct
      cy.get("p").contains(/cards available: 3/i);
    });

    it("the cards counter should display 0 when the database is empty", function () {
      // Assert the cards available counter is correct
      cy.get("p").contains(/cards available: 0/i);
    });

    it("it changes to search results when there is a search term available", function () {
      // Add a small amount of data to test
      cy.addSampleData();

      // Reload the page
      cy.visit("/");

      // Click on the button to open the search bar
      cy.get("#search-bar-field").find("button").contains("Search").click();

      // Searches for NVIDIA cards
      cy.get("#search-bar-input").type("rtx 3060");

      // Assert the search results counter is correct
      cy.get("p").contains(/search results: 1/i);
    });
  });
});
