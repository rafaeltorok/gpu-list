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
    cy.get("#page-index").find("button").contains("Show index").click();

    // Confirm the hide button is visible
    cy.get("#page-index").find("button").should("contain", "Hide index");
  });

  it("checking if the graphics cards are present in the index", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Select the sample data form the data file
      const firstGpu = gpuList[0];
      const secondGpu = gpuList[1];
      const thirdGpu = gpuList[2];

      // Expand the index to display all available cards
      cy.get("#page-index")
        .find("#show-index-button")
        .contains("Show index")
        .click();

      // Confirm all cards are present on the index
      cy.get(".page-index-list li")
        .eq(0)
        .contains(getFullModel(firstGpu));

      cy.get(".page-index-list li").eq(1).contains(getFullModel(secondGpu));

      cy.get(".page-index-list li").eq(2).contains(getFullModel(thirdGpu));
    });
  });

  it("clicking on an index item", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Get a test card from the list
      const gpu = gpuList[0];

      // Open the index
      cy.get("#page-index").find("button").contains("Show index").click();

      // Selects the first item
      cy.indexSelector(getFullModel(gpu));
    });
  });

  it("the index can be hidden", function () {
    // Open the index
    cy.get("#page-index").find("button").contains("Show index").click();

    // Confirm it has been opened
    cy.get("#page-index").find("button").should("contain", "Hide index");

    // Click on the hide button
    cy.get("#page-index").find("button").contains("Hide index").click();

    // Confirm it is hidden
    cy.get("#page-index").find("button").should("contain", "Show index");
  });

  it("the back to index button works properly", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Get a test card from the list
      const gpu = gpuList[0];

      // Open the index
      cy.get("#page-index").find("button").contains("Show index").click();

      // Click on the first index item
      cy.indexSelector(getFullModel(gpu));

      // Click on the back to index button to ensure it is working
      cy.get(".gpu-data-table")
        .eq(0)
        .parent()
        .find(".back-to-index-button")
        .click();

      // Confirm the user view has returned to the index
      cy.get(".page-index-list").should("be.visible");
    });
  });
});
