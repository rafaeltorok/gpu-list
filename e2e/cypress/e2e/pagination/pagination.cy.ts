describe("testing the pages navigation", function () {
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

  it("the pagination controls are correctly displayed", function () {
    // Assert if all control buttons are present
    cy.get(".MuiPagination-ul > :nth-child(1)").should("be.visible"); // Return to first page
    cy.get(".MuiPagination-ul > :nth-child(2)").should("be.visible"); // Previous page
    cy.get(".MuiPagination-ul > :nth-child(3)").contains("1"); // First page
    cy.get(".MuiPagination-ul > :nth-child(4)").contains("2"); // Second page
    cy.get(".MuiPagination-ul > :nth-child(5)").should("be.visible"); // Next page
    cy.get(".MuiPagination-ul > :nth-child(6)").should("be.visible"); // Go to last
  });

  it("the page selection works", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Click on the 2nd page selector
      cy.get(".MuiPagination-ul > :nth-child(4)").contains("2").click();

      // Assert the correct page number is present within the URL params
      cy.location("search").should((search) => {
        const params = new URLSearchParams(search);
        expect(params.get("page")).to.equal("2");
      });

      // Assert the 11th card is present within the second page
      const gpu = gpuList[10];

      cy.get(".gpu-data-table").should(
        "contain",
        `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`,
      );
    });
  });

  it("the previous and next buttons works", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Go to the second page
      cy.get(".MuiPagination-ul > :nth-child(5)").click();

      // Assert the correct page number is present within the URL params
      cy.location("search").should((search) => {
        const params = new URLSearchParams(search);
        expect(params.get("page")).to.equal("2");
      });

      // Assert the 11th card is present within the second page
      const secondPageCard = gpuList[10];

      cy.get(".gpu-data-table").should(
        "contain",
        `${secondPageCard.manufacturer} ${secondPageCard.gpuline} ${secondPageCard.model}`,
      );

      // Return to the first page
      cy.get(".MuiPagination-ul > :nth-child(2)").click();

      // Assert the correct page number is present within the URL params
      cy.location("search").should((search) => {
        const params = new URLSearchParams(search);
        expect(params.get("page")).to.equal("1");
      });

      // Assert the 1st card is present within the first page
      const firstPageCard = gpuList[0];

      cy.get(".gpu-data-table").should(
        "contain",
        `${firstPageCard.manufacturer} ${firstPageCard.gpuline} ${firstPageCard.model}`,
      );
    });
  });

  it("the first and last page buttons works", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Select a small limit in order to get multiple pages
      const itemsPerPage = "3";
      cy.get("#limit-options").select(itemsPerPage).should("have.value", itemsPerPage);

      // Confirm the limit has been correctly setup within the URL params
      cy.location("search").should((search) => {
        const params = new URLSearchParams(search);
        expect(params.get("limit")).to.equal(itemsPerPage);
      });

      // Go to the last page
      cy.get(".MuiPagination-ul > :last-child").click();

      // Assert the last card is present within the second page
      const lastPageCard = gpuList[gpuList.length - 1];

      cy.get(".gpu-data-table").should(
        "contain",
        `${lastPageCard.manufacturer} ${lastPageCard.gpuline} ${lastPageCard.model}`,
      );

      // Click on the return to the first page button
      cy.get(".MuiPagination-ul > :first-child").click();

      // Assert the 1st card is present within the first page
      const firstPageCard = gpuList[0];

      cy.get(".gpu-data-table").should(
        "contain",
        `${firstPageCard.manufacturer} ${firstPageCard.gpuline} ${firstPageCard.model}`,
      );
    });
  });
});
