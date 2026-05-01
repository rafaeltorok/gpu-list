// Utils
import calculatePerformance from "../../../../shared/utils/calculatePerformance";
import getFullModel from "../../support/utils/getFullModel";

// E2E tests
describe("Testing the add form", function () {
  beforeEach(function () {
    cy.setupDatabase();

    // Access the main page
    cy.visit("/");
  });
  
  it("a new GPU can be added", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Get a test card from the list
      const gpu = gpuList[0];

      // Calculate the theoretical performance
      const performance = calculatePerformance(gpu);

      // Fill the form with the chosen card data
      cy.fillAddForm(gpu);

      // Click on the submit button
      cy.get(".add-gpu-submit-button").click();

      // Confirm each data row is being correctly displayed
      cy.showData(gpu);
      cy.get(".gpu-data-table th")
        .contains("CORES")
        .siblings()
        .contains(gpu.cores);
      cy.get(".gpu-data-table").contains("TMUs").siblings().contains(gpu.tmus);
      cy.get(".gpu-data-table").contains("ROPs").siblings().contains(gpu.rops);
      cy.get(".gpu-data-table")
        .contains("VRAM")
        .siblings()
        .contains(`${gpu.vram}GB ${gpu.memtype}`);
      cy.get(".gpu-data-table")
        .contains("BUS WIDTH")
        .siblings()
        .contains(`${gpu.bus} bit`);
      cy.get(".gpu-data-table")
        .contains("BASE CLOCK")
        .siblings()
        .contains(`${gpu.baseclock} MHz`);
      cy.get(".gpu-data-table")
        .contains("BOOST CLOCK")
        .siblings()
        .contains(`${gpu.boostclock} MHz`);
      cy.get(".gpu-data-table")
        .contains("MEMORY CLOCK")
        .siblings()
        .contains(`${gpu.memclock} Gbps effective`);
      cy.get(".gpu-data-table")
        .contains("FP32(float)")
        .siblings()
        .contains(`${performance[0]}`);
      cy.get(".gpu-data-table")
        .contains("TEXTURE RATE")
        .siblings()
        .contains(`${performance[1]}`);
      cy.get(".gpu-data-table")
        .contains("PIXEL RATE")
        .siblings()
        .contains(`${performance[2]}`);
      cy.get(".gpu-data-table")
        .contains("BANDWIDTH")
        .siblings()
        .contains(`${performance[3]}`);
    });
  });

  it("the GPU Line field is not required to add a new card", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Get a card from the list without a specific line
      const gpu = gpuList[3];

      // Fill the form and click on the add button
      cy.fillAddForm({ ...gpuList[3], gpuline: " " });
      // Since Cypress does not allow empty inputs, a single whitespace will do it
      cy.get(".add-gpu-submit-button").click();

      // Confirm the new card has been added
      cy.contains(getFullModel(gpu));
    });
  });

  it("an empty name cannot be added", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Get a card from the list
      const gpu = gpuList[0];

      // Fill the form and click on the add button
      cy.fillAddForm({
        ...gpu,
        manufacturer: " ",
        gpuline: " ",
        model: " ",
      });
      cy.get(".add-gpu-submit-button").click();
      
      // Assert an alert message is displayed and no card has been added
      cy.on("window:alert", (text) => {
        expect(text).to.equal("Invalid GPU data");
      });
      cy.get(".gpu-data-table").should("not.exist");
    });
  });

  it("invalid specifications", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Get a card from the list
      const gpu = gpuList[0];

      // Fill the form and click on the add button
      cy.fillAddForm({
        ...gpu,
        cores: "no cores",
        tmus: -1,
        rops: 0,
        vram: 0,
        bus: -1,
        memtype: " ",
      });
      cy.get(".add-gpu-submit-button").click();

      // Assert an alert message is displayed and no card has been added
      cy.on("window:alert", (text) => {
        expect(text).to.equal("Invalid GPU data");
      });
      cy.get(".gpu-data-table").should("not.exist");
    });
  });

  it("invalid clock speeds", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Get a card from the list
      const gpu = gpuList[0];

      // Fill the form and click on the add button
      cy.fillAddForm({
        ...gpu,
        baseclock: -1,
        boostclock: 0,
        memclock: "no clock",
      });
      cy.get(".add-gpu-submit-button").click();

      // Assert an alert message is displayed and no card has been added
      cy.on("window:alert", (text) => {
        expect(text).to.equal("Invalid GPU data");
      });
      cy.get(".gpu-data-table").should("not.exist");
    });
  });

  it("invalid data does not hide the add form", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Get a card from the list
      const gpu = gpuList[0];

      // Fill the form and click on the add button
      cy.fillAddForm({
        ...gpu,
        cores: 0
      });

      // Assert an alert message is displayed and that the add form is still visible
      cy.on("window:alert", (text) => {
        expect(text).to.equal("Invalid GPU data");
      });
      cy.get(".add-gpu-button").contains("Cancel");

      // Confirm no card has been added
      cy.get(".gpu-data-table").should("not.exist");
    });
  });

  it("invalid data does not erase the current inputs", function () {
    cy.fixture('gpus').then((gpuList) => {
      // Get a card from the list
      const gpu = gpuList[0];

      // Fill the form and click on the add button
      cy.fillAddForm({
        ...gpu,
        cores: 0
      });
      cy.get(".add-gpu-submit-button").click();

      // Assert an alert message is displayed and that the form input data is still present
      cy.on("window:alert", (text) => {
        expect(text).to.equal("Invalid GPU data");
      });

      // Confirm no card has been added
      cy.get(".gpu-data-table").should("not.exist");

      // Assert the user inputs are still present on the add form
      cy.get("#manufacturer").should("have.value", gpu.manufacturer);
      cy.get("#gpuline").should("have.value", gpu.gpuline);
      cy.get("#model").should("have.value", gpu.model);
      cy.get("#cores").should("have.value", "0");
      cy.get("#tmus").should("have.value", gpu.tmus);
      cy.get("#rops").should("have.value", gpu.rops);
      cy.get("#vram").should("have.value", gpu.vram);
      cy.get("#bus").should("have.value", gpu.bus);
      cy.get("#memtype").should("have.value", gpu.memtype);
      cy.get("#baseclock").should("have.value", gpu.baseclock);
      cy.get("#boostclock").should("have.value", gpu.boostclock);
      cy.get("#memclock").should("have.value", gpu.memclock);
    });
  });
});
