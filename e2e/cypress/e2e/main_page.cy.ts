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

  describe("the show all data button works", function () {
    beforeEach(function () {
      // Add a small amount of data to test
      cy.addSampleData();

      // Access the main page
      cy.visit("/");
    });

    it("it expands all tables on the page", function () {
      cy.fixture('gpus').then((gpuList) => {
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
});
