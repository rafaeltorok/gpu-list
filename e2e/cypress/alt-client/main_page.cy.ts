describe("Testing the alternative client", function () {
  beforeEach(function () {
    cy.setupDatabase();

    // Access the main page
    cy.visit("/");
  });

  describe("basic page access", function () {
    it("main page can be opened", function () {
      cy.contains(/gpu list/i);
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
      const itemsPerPage = "4";
      
      // Select an option
      cy.get("#limit-options")
        .select(itemsPerPage)
        .should("have.value", itemsPerPage);

      // Confirm the new limit value has been inserted into the URL params
      cy.location("search").should((search) => {
        const params = new URLSearchParams(search);
        expect(params.get("limit")).to.equal(String(itemsPerPage));
      });
    });

    it("it correctly paginates the data based on the selected value", function () {
      const itemsPerPage = "4";

      // Select an option
      cy.get("#limit-options")
        .select(itemsPerPage)
        .should("have.value", itemsPerPage);

      // Confirm the correct number of cards are being shown
      cy.get(".gpu-card").should("have.length", Number(itemsPerPage));
    });
  });

  describe("the cards available counter", function () {
    it("the cards counter should display the correct amount of cards", function () {
      // Add a small amount of data to test
      cy.addSampleData();

      // Reload the page
      cy.visit("/");

      // Assert the cards available counter is correct
      cy.get("main").contains(/cards available: 3/i);
    });

    it("the cards counter should not be displayed when the database is empty", function () {
      // Assert the cards available counter is not present
      cy.get("main").should("not.contain", /cards available: 0/i);

      // Confirm a message is displayed within the web UI
      cy.get("main").contains(/no gpus available on the database/i);
    });

    it("it changes to search results when there is a search term available", function () {
      // Add a small amount of data to test
      cy.addSampleData();

      // Reload the page
      cy.visit("/");

      // Search for a particular card
      cy.get("input").type("rtx 3060");

      // Assert the search results counter is correct
      cy.get("p").contains(/search results: 1/i);
    });
  });
});
