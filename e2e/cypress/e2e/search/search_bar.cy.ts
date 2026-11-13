import { GpuType } from "../../../../shared/types/types";

// Helper function
// iterates over the list and assert each model is present within
function checkCardsFromList(gpuList: GpuType[]) {
  for (let i = 0; i < gpuList.length; i++) {
    const currentCard = gpuList[i];

    // Assert each card is present within the page
    cy.get(".gpu-data-table")
      .eq(i)
      .should("contain", `${currentCard.model}`);
  }
}

// E2E tests
describe("testing the search bar", function () {
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

  it("the search bar can be displayed", function () {
    // Click on the button to open the search bar
    cy.get("#search-bar-field").find("button").contains("Search").click();

    // Confirm it has been opened
    cy.get("#search-bar-field").find("button").should("contain", "Cancel");
  });

  it("searching for specific manufacturers only", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Filter the original list by the manufacturer name
      const nvidiaCards = gpuList.filter((gpu: GpuType) => {
        return gpu.manufacturer.toLowerCase() === "nvidia"
      });
      const amdCards = gpuList.filter((gpu: GpuType) => {
        return gpu.manufacturer.toLowerCase() === "amd"
      });
      const intelCards = gpuList.filter((gpu: GpuType) => {
        return gpu.manufacturer.toLowerCase() === "intel"
      });

      // Click on the button to open the search bar
      cy.get("#search-bar-field").find("button").contains("Search").click();

      // Search for NVIDIA cards
      cy.get("#search-bar-input").clear().type("nvidia");

      // Confirm the correct number of cards have been found
      cy.get(".gpu-data-table").should("have.length", nvidiaCards.length);

      // Assert each card present is from the current manufacturer
      checkCardsFromList(nvidiaCards);

      // Search for AMD cards
      cy.get("#search-bar-input").clear().type("amd");

      // Assert each card present is from the current manufacturer
      checkCardsFromList(amdCards);

      // Search for Intel cards
      cy.get("#search-bar-input").clear().type("intel");

      // Assert each card present is from the current manufacturer
      checkCardsFromList(intelCards);
    });
  });

  it("filtering the desired graphics card line", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Filter the original list by the line name
      const geforceCards = gpuList.filter((gpu: GpuType) => {
        return gpu.gpuline.toLowerCase() === "geforce"
      });
      const radeonCards = gpuList.filter((gpu: GpuType) => {
        return gpu.gpuline.toLowerCase() === "radeon"
      });
      const arcCards = gpuList.filter((gpu: GpuType) => {
        return gpu.gpuline.toLowerCase() === "arc"
      });

      // Click on the button to open the search bar
      cy.get("#search-bar-field").find("button").contains("Search").click();

      // Search for GeForce cards
      cy.get("#search-bar-input").clear().type("geforce");

      // Confirm the correct number of cards have been found
      cy.get(".gpu-data-table").should("have.length", geforceCards.length);

      // Assert each card present is from the current line
      checkCardsFromList(geforceCards);

      // Search for Radeon cards
      cy.get("#search-bar-input").clear().type("radeon");

      // Confirm the correct number of cards have been found
      cy.get(".gpu-data-table").should("have.length", radeonCards.length);

      // Assert each card present is from the current line
      checkCardsFromList(radeonCards);

      // Search for Arc cards
      cy.get("#search-bar-input").clear().type("arc");

      // Confirm the correct number of cards have been found
      cy.get(".gpu-data-table").should("have.length", arcCards.length);

      // Assert each card present is from the current line
      checkCardsFromList(arcCards);
    });
  });

  it("filtering the cards by the secondary line", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Filter the original list by the secondary line
      const rtxCards = gpuList.filter((gpu: GpuType) => {
        return gpu.model.toLowerCase().includes("rtx");
      });

      // Open the search bar
      cy.get("#search-bar-field").find("button").contains("Search").click();

      // Search for the secondary line
      cy.get("#search-bar-input").clear().type("rtx");

      // Confirm the correct number of cards have been found
      cy.get(".gpu-data-table").should("have.length", rtxCards.length);

      // Assert each card present is from the current line
      checkCardsFromList(rtxCards);
    });
  });

  it("filtering by specific model variations or names", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Search by XTX variants only
      const xtxCards = gpuList.filter((gpu: GpuType) => {
        return gpu.model.toLowerCase().includes("xtx");
      });

      // Open the search bar
      cy.get("#search-bar-field").find("button").contains("Search").click();

      // Input the search term
      cy.get("#search-bar-input").clear().type("xtx");

      // Confirm the correct number of cards have been found
      cy.get(".gpu-data-table").should("have.length", xtxCards.length);

      // Confirm the models are correct
      checkCardsFromList(xtxCards);

      // Search by cards that contain a model name with '70'
      const cardsWith70 = gpuList.filter((gpu: GpuType) => {
        return gpu.model.toLowerCase().includes("70");
      });

      // Input the search term
      cy.get("#search-bar-input").clear().type("70");

      // Confirm the correct number of cards have been found
      cy.get(".gpu-data-table").should("have.length", cardsWith70.length);

      // Confirm the models are correct
      checkCardsFromList(cardsWith70);
    });
  });

  it("the index is also filtered by the search results", function () {
    cy.fixture("gpus").then((gpuList) => {
      // Search by XTX variants only
      const geforceCards = gpuList.filter((gpu: GpuType) => {
        return gpu.model.toLowerCase().includes("geforce");
      });

      // Open the search bar
      cy.get("#search-bar-field").find("button").contains("Search").click();

      // Search by the GPU line
      cy.get("#search-bar-input").clear().type("geforce");

      // Open the index
      cy.get("#page-index-container")
        .find("#show-index-button")
        .contains("Show index")
        .click();

      // Confirm only the filtered cards appear on the index list
      for (let i = 0; i < geforceCards.length; i++) {
        const gpu = gpuList[i];

        cy.get(".index-list li").eq(i).contains(
          `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`
        );
      }
    });
  });
});
