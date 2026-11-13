// Utils
import getFullModel from "../../support/utils/getFullModel";

describe("Testing the index", function () {
  beforeEach(function () {
    cy.setupDatabase();

    // Add a small amount of cards as sample data
    cy.addSampleData();

    // Access the main page
    cy.visit("/");
  });

  it("the index can be shown", function () {
    // Click on the button to expand the index
    cy.get("#page-index-container")
      .find("button")
      .contains("Show index")
      .click();

    // Confirm the hide button is visible
    cy.get("#page-index-container")
      .find("button")
      .should("contain", "Hide index");
  });

  it("checking if the graphics cards are present in the index", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Select the sample data form the data file
      const firstGpu = gpuList[0];
      const secondGpu = gpuList[1];
      const thirdGpu = gpuList[2];

      // Expand the index to display all available cards
      cy.get("#page-index-container")
        .find("#show-index-button")
        .contains("Show index")
        .click();

      // Confirm all cards are present on the index
      cy.get(".index-list li").eq(0).contains(getFullModel(firstGpu));

      cy.get(".index-list li").eq(1).contains(getFullModel(secondGpu));

      cy.get(".index-list li").eq(2).contains(getFullModel(thirdGpu));
    });
  });

  it("clicking on an index item expands the respective data table", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Get a test card from the list
      const gpu = gpuList[0];

      // Open the index
      cy.get("#page-index-container")
        .find("button")
        .contains("Show index")
        .click();

      // Selects the respective card name on the index
      cy.indexSelector(getFullModel(gpu));

      // Confirm all specifications are being displayed
      cy.checkSpecs(gpu, "GB");
    });
  });

  it("the index can be hidden", function () {
    // Open the index
    cy.get("#page-index-container")
      .find("button")
      .contains("Show index")
      .click();

    // Confirm it has been opened
    cy.get("#page-index-container")
      .find("button")
      .should("contain", "Hide index");

    // Click on the hide button
    cy.get("#page-index-container")
      .find("button")
      .contains("Hide index")
      .click();

    // Confirm it is hidden
    cy.get("#page-index-container")
      .find("button")
      .should("contain", "Show index");
  });

  it("the back to index button works properly", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Get a test card from the list
      const gpu = gpuList[0];

      // Open the index
      cy.get("#page-index-container")
        .find("button")
        .contains("Show index")
        .click();

      // Click on the first index item
      cy.indexSelector(getFullModel(gpu));

      // Click on the back to index button to ensure it is working
      cy.get(".gpu-data-table")
        .eq(0)
        .parent()
        .find(".back-to-index-button")
        .click();

      // Confirm the user view has returned to the index
      cy.get(".index-list").should("be.visible");
    });
  });

  describe("pagination within the index", function () {
    beforeEach(function () {
      cy.fixture("gpus").then((gpuList) => {
        cy.setupDatabase();

        // Add all available cards on the list to test with multiple manufacturers
        for (const gpu of gpuList) {
          cy.createGpu(gpu);
        }

        // Access the main page
        cy.visit("/");
      });
    });

    it("the index should only display the current page's cards", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Open the index
        cy.get("#page-index-container")
          .find("button")
          .contains("Show index")
          .click();

        // Select only the first page cards
        const firstPageCards = gpuList.slice(0, 9);

        // Confirm the index contains the correct amount of items per page
        cy.get(".index-list li").should("have.length", 10);

        // Assert the index is only displaying the current page's cards
        for (let i = 0; i < firstPageCards.length; i++) {
          const gpu = firstPageCards[i];

          cy.get(".index-list li").contains(
            `${gpu.model}`
          );
        }

        // Go to the second page
        cy.get('.MuiPagination-ul > :nth-child(5)').click();

        // Select only the second page cards
        const secondPageCards = gpuList.slice(10, 19);

        // Confirm the index contains the correct amount of items per page
        cy.get(".index-list li").should("have.length", secondPageCards.length);

        // Assert the index is only displaying the current page's cards
        for (let i = 0; i < secondPageCards.length; i++) {
          const gpu = secondPageCards[i];

          cy.get(".index-list li").contains(
            `${gpu.model}`
          );
        }
      });
    });

    it.only("the index should display only the amount of items per page", function () {
      cy.fixture("gpus").then((gpuList) => {
        const itemsPerPage = 3;

        // Select an amount of items per page
        cy.get("#limit-options")
          .select(String(itemsPerPage))
          .should("have.value", String(itemsPerPage));

        // Confirm the new limit value has been inserted into the URL params
        cy.location('search').should((search) => {
          const params = new URLSearchParams(search);
          expect(params.get("limit")).to.equal(String(itemsPerPage));
        });

        // Open the index
        cy.get("#page-index-container")
          .find("button")
          .contains("Show index")
          .click();

        // Confirm the index contains the correct amount of items per page
        cy.get(".index-list li").should("have.length", itemsPerPage);

        // Assert the index is only displaying the current page's cards
        for (let i = 0; i < itemsPerPage; i++) {
          const gpu = gpuList[i];

          cy.get(".index-list li").contains(
            `${gpu.model}`
          );
        }
      });
    });
  });
});
