describe("Testing the add form", function () {
  beforeEach(function () {
    cy.setupDatabase();

    // Access the main page
    cy.visit("/alt");
  });

  describe("valid data", function () {
    it("a new GPU can be added", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Get a test card from the list
        const gpu = gpuList[0];

        // Fill the form with the chosen card data
        cy.fillAddForm(gpu);

        // Click on the submit button
        cy.get("#add-gpu-submit-button").click();

        // Confirm the message on the notification dialog is correct
        cy.get('[open=""] > .dialog-message').contains(
          `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model} was added!`,
        );
        cy.get('[open=""] > .dialog-button').click(); // Close the notification

        // Confirm the new card has been added
        cy.get(".gpu-card-header h2")
          .contains(`${gpu.manufacturer} ${gpu.gpuline}`);
        cy.get(".gpu-card-header h3")
          .contains(`${gpu.model}`);
        cy.get(".spec-value")
          .contains(`${gpu.vram}GB ${gpu.memtype}`);
      });
    });

    it("the GPU Line field is not required to add a new card", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Get a card from the list without a specific line
        const gpu = gpuList[3];

        // Fill the form and click on the submit button
        cy.fillAddForm({ ...gpuList[3], gpuline: " " }); // Cypress does not allow empty inputs
        cy.get("#add-gpu-submit-button").click();

        // Confirm the message on the notification dialog is correct
        cy.get('[open=""] > .dialog-message').contains(
          `${gpu.manufacturer} ${gpu.model} was added!`,
        );
        cy.get('[open=""] > .dialog-button').click(); // Close the notification

        // Confirm the new card has been added
        cy.get(".gpu-card-header h2")
          .contains(`${gpu.manufacturer}`);
        cy.get(".gpu-card-header h3")
          .contains(`${gpu.model}`);
        cy.get(".spec-value")
          .contains(`${gpu.vram}GB ${gpu.memtype}`);
      });
    });
  });

  describe("invalid data", function () {
    it("an empty name cannot be added", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Get a card from the list
        const gpu = gpuList[0];

        // Fill the form and click on the submit button
        cy.fillAddForm({
          ...gpu,
          manufacturer: " ",
          gpuline: " ",
          model: " ",
        });
        cy.get("#add-gpu-submit-button").click();

        // Confirm there is a warning about the invalid data
        cy.get('[open=""] > .dialog-message').contains(/invalid gpu data/i);
        cy.get('[open=""] > .dialog-button').click(); // Close the notification

        // Assert no new card has been added
        cy.get(".gpu-card").should("not.exist");
      });
    });

    it("invalid specifications", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Get a card from the list
        const gpu = gpuList[0];

        // Fill the form and click on the submit button
        cy.fillAddForm({
          ...gpu,
          cores: "no cores",
          tmus: -1,
          rops: 0,
          vram: 0,
          bus: -1,
          memtype: " ",
        });
        cy.get("#add-gpu-submit-button").click();

        // Confirm there is a warning about the invalid data
        cy.get('[open=""] > .dialog-message').contains(/invalid gpu data/i);
        cy.get('[open=""] > .dialog-button').click(); // Close the notification

        // Assert no new card has been added
        cy.get(".gpu-card").should("not.exist");
      });
    });

    it("invalid clock speeds", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Get a card from the list
        const gpu = gpuList[0];

        // Fill the form and click on the submit button
        cy.fillAddForm({
          ...gpu,
          baseclock: -1,
          boostclock: 0,
          memclock: "no clock",
        });
        cy.get("#add-gpu-submit-button").click();

        // Confirm there is a warning about the invalid data
        cy.get('[open=""] > .dialog-message').contains(/invalid gpu data/i);
        cy.get('[open=""] > .dialog-button').click(); // Close the notification

        // Assert no new card has been added
        cy.get(".gpu-card").should("not.exist");
      });
    });

    it("invalid data does not hide the add form", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Get a card from the list
        const gpu = gpuList[0];

        // Fill the form and click on the submit button
        cy.fillAddForm({
          ...gpu,
          cores: 0,
        });
        cy.get("#add-gpu-submit-button").click();

        // Confirm there is a warning about the invalid data
        cy.get('[open=""] > .dialog-message').contains(/invalid gpu data/i);
        cy.get('[open=""] > .dialog-button').click(); // Close the notification

        // Confirm the form remains opened
        cy.get(".add-gpu-toggle").contains("Cancel");

        // Assert no new card has been added
        cy.get(".gpu-card").should("not.exist");
      });
    });

    it("invalid data does not erase the current inputs", function () {
      cy.fixture("gpus").then((gpuList) => {
        // Get a card from the list
        const gpu = gpuList[0];

        // Fill the form and click on the submit button
        cy.fillAddForm({
          ...gpu,
          cores: 0,
        });
        cy.get("#add-gpu-submit-button").click();

        // Confirm there is a warning about the invalid data
        cy.get('[open=""] > .dialog-message').contains(/invalid gpu data/i);
        cy.get('[open=""] > .dialog-button').click(); // Close the notification

        // Assert no new card has been added
        cy.get(".gpu-card").should("not.exist");

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
});
