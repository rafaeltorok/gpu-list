import { addGpu, showGPUData, checkRowData, indexSelector } from "./helper";

describe("GPU List app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/api/testing/reset`);
    cy.visit("/");
  });

  it("debug env", () => {
    cy.log("Backend:", Cypress.env("BACKEND"));
  });

  describe("Basic page access", function () {
    it("main page can be opened", function () {
      cy.contains("GPU List");
    });
  });

  describe("Testing the add form", function () {
    it("a new GPU can be added", function () {
      addGpu({
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "RTX 3060 Gaming X Trio",
        cores: 3584,
        tmus: 112,
        rops: 48,
        vram: 12,
        bus: 192,
        memtype: "GDDR6",
        baseclock: 1320,
        boostclock: 1965,
        memclock: 15,
      });

      showGPUData("MSI GeForce RTX 3060 Gaming X Trio");
      cy.get(".gpu-data-table th")
        .contains("CORES")
        .siblings()
        .contains("3584");
      cy.get(".gpu-data-table").contains("TMUs").siblings().contains("112");
      cy.get(".gpu-data-table").contains("ROPs").siblings().contains("48");
      cy.get(".gpu-data-table")
        .contains("VRAM")
        .siblings()
        .contains("12GB GDDR6");
      cy.get(".gpu-data-table")
        .contains("BUS WIDTH")
        .siblings()
        .contains("192 bit");
      cy.get(".gpu-data-table")
        .contains("BASE CLOCK")
        .siblings()
        .contains("1320 MHz");
      cy.get(".gpu-data-table")
        .contains("BOOST CLOCK")
        .siblings()
        .contains("1965 MHz");
      cy.get(".gpu-data-table")
        .contains("MEMORY CLOCK")
        .siblings()
        .contains("15 Gbps effective");
      cy.get(".gpu-data-table")
        .contains("FP32(float)")
        .siblings()
        .contains("14.09 TFLOPS");
      cy.get(".gpu-data-table")
        .contains("TEXTURE RATE")
        .siblings()
        .contains("220.08 GTexel/s");
      cy.get(".gpu-data-table")
        .contains("PIXEL RATE")
        .siblings()
        .contains("94.32 GPixel/s");
      cy.get(".gpu-data-table")
        .contains("BANDWIDTH")
        .siblings()
        .contains("360.00 GB/s");
    });

    it("the GPU Line field is not required to add a new one", function () {
      addGpu({
        manufacturer: "NVIDIA",
        gpuline: " ",
        model: "RTX PRO 6000 Blackwell",
        cores: 24064,
        tmus: 752,
        rops: 192,
        vram: 96,
        bus: 512,
        memtype: "GDDR7",
        baseclock: 1590,
        boostclock: 2617,
        memclock: 28,
      });

      cy.contains("NVIDIA RTX PRO 6000 Blackwell");
    });

    it("an empty name cannot be added", function () {
      addGpu({
        manufacturer: " ",
        gpuline: " ",
        model: " ",
        cores: 3584,
        tmus: 112,
        rops: 48,
        vram: 12,
        bus: 192,
        memtype: "GDDR6",
        baseclock: 1320,
        boostclock: 1965,
        memclock: 15,
      });

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Invalid GPU data");
      }).then(() => {
        cy.get(".gpu-data-table").should("not.exist");
      });
    });

    it("invalid specifications", function () {
      addGpu({
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "RTX 3060 Gaming X Trio",
        cores: "no cores",
        tmus: -1,
        rops: 0,
        vram: 0,
        bus: -1,
        memtype: " ",
        baseclock: 1320,
        boostclock: 1965,
        memclock: 15,
      });

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Invalid GPU data");
      }).then(() => {
        cy.get(".gpu-data-table").should("not.exist");
      });
    });

    it("invalid clock speeds", function () {
      addGpu({
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "RTX 3060 Gaming X Trio",
        cores: 3584,
        tmus: 112,
        rops: 48,
        vram: 12,
        bus: 192,
        memtype: "GDDR6",
        baseclock: -1,
        boostclock: 0,
        memclock: "no clock",
      });

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Invalid GPU data");
      }).then(() => {
        cy.get(".gpu-data-table").should("not.exist");
      });
    });

    it("invalid data does not hide the add form", function () {
      addGpu({
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "RTX 3060 Gaming X Trio",
        cores: 3584,
        tmus: 112,
        rops: 48,
        vram: 12,
        bus: 192,
        memtype: "GDDR6",
        baseclock: -1,
        boostclock: 0,
        memclock: "no clock",
      });

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Invalid GPU data");
      })
        .then(() => {
          cy.get(".gpu-data-table").should("not.exist");
        })
        .then(() => {
          cy.get(".add-gpu-button").contains("Cancel");
        });
    });

    it("invalid data does not erase the current inputs", function () {
      addGpu({
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "RTX 3060 Gaming X Trio",
        cores: 3584,
        tmus: 112,
        rops: 48,
        vram: 12,
        bus: 192,
        memtype: "GDDR6",
        baseclock: -1,
        boostclock: 0,
        memclock: 0,
      });

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Invalid GPU data");
      })
        .then(() => {
          cy.get(".gpu-data-table").should("not.exist");
        })
        .then(() => {
          cy.get("#manufacturer").should("have.value", "MSI");
          cy.get("#gpuline").should("have.value", "GeForce");
          cy.get("#model").should("have.value", "RTX 3060 Gaming X Trio");
          cy.get("#cores").should("have.value", "3584");
          cy.get("#tmus").should("have.value", "112");
          cy.get("#rops").should("have.value", "48");
          cy.get("#vram").should("have.value", "12");
          cy.get("#bus").should("have.value", "192");
          cy.get("#memtype").should("have.value", "GDDR6");
          cy.get("#baseclock").should("have.value", "-1");
          cy.get("#boostclock").should("have.value", "0");
          cy.get("#memclock").should("have.value", "0");
        });
    });
  });

  describe("testing the GPU data table", function () {
    beforeEach(function () {
      cy.request("POST", "/api/gpus", {
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "RTX 3060 Gaming X Trio",
        cores: 3584,
        tmus: 112,
        rops: 48,
        vram: 12,
        bus: 192,
        memtype: "GDDR6",
        baseclock: 1320,
        boostclock: 1965,
        memclock: 15,
      });

      cy.visit("/");

      showGPUData("MSI GeForce RTX 3060 Gaming X Trio");
    });

    it("all GPU specifications are displayed when clicking the show button", function () {
      cy.get(".gpu-data-table thead tr th").should(
        "contain",
        "MSI GeForce RTX 3060 Gaming X Trio",
      );
      checkRowData("CORES", 3584);
      checkRowData("TMUs", 112);
      checkRowData("ROPs", 48);
      checkRowData("VRAM", "12GB GDDR6");
      checkRowData("BUS WIDTH", "192 bit");
      checkRowData("BASE CLOCK", "1320 MHz");
      checkRowData("BOOST CLOCK", "1965 MHz");
      checkRowData("MEMORY CLOCK", "15 Gbps effective");
    });

    it("the theoretical performance is correct", function () {
      checkRowData("FP32(float)", "14.09 TFLOPS");
      checkRowData("TEXTURE RATE", "220.08 GTexel/s");
      checkRowData("PIXEL RATE", "94.32 GPixel/s");
      checkRowData("BANDWIDTH", "360.00 GB/s");
    });

    it("the GPU can be deleted", function () {
      cy.get(".gpu-data-table tfoot #delete-gpu-button").click();
      cy.get(".gpu-data-table").should("not.exist");
    });

    it("the amount of VRAM is correctly displayed as either GB or MB", function () {
      cy.get(".gpu-data-table thead tr th").should(
        "contain",
        "MSI GeForce RTX 3060 Gaming X Trio",
      );
      checkRowData("VRAM", "12GB GDDR6");

      cy.request("POST", "/api/gpus", {
        manufacturer: "NVIDIA",
        gpuline: "GeForce",
        model: "GT 210",
        cores: 16,
        tmus: 8,
        rops: 4,
        vram: 0.512,
        bus: 64,
        memtype: "DDR3",
        baseclock: 520,
        boostclock: 520,
        memclock: 0.8,
      });
      
      cy.visit("/");

      showGPUData("NVIDIA GeForce GT 210");
      cy.get(".gpu-data-table thead tr th").should(
        "contain",
        "NVIDIA GeForce GT 210",
      );
      checkRowData("VRAM", "512MB DDR3");
    });
  });

  describe("the show all data button works", function () {
    beforeEach(function () {
      cy.request("POST", "/api/gpus", {
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "RTX 3060 Gaming X Trio",
        cores: 3584,
        tmus: 112,
        rops: 48,
        vram: 12,
        bus: 192,
        memtype: "GDDR6",
        baseclock: 1320,
        boostclock: 1965,
        memclock: 15,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "GTX 970 OC",
        cores: 1664,
        tmus: 104,
        rops: 56,
        vram: 4,
        bus: 256,
        memtype: "GDDR5",
        baseclock: 1102,
        boostclock: 1304,
        memclock: 7,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "GTX 650 OC",
        cores: 384,
        tmus: 32,
        rops: 16,
        vram: 1,
        bus: 128,
        memtype: "GDDR5",
        baseclock: 1084,
        boostclock: 1084,
        memclock: 5,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "NVIDIA",
        gpuline: " ",
        model: "RTX PRO 6000 Blackwell",
        cores: 24064,
        tmus: 752,
        rops: 192,
        vram: 96,
        bus: 512,
        memtype: "GDDR7",
        baseclock: 1590,
        boostclock: 2617,
        memclock: 28,
      });

      cy.visit("/");
    });

    it("it expands all tables on the page", function () {
      cy.get(".gpu-data-table")
        .eq(0)
        .then(($table) => {
          cy.wrap($table)
            .find("thead tr th")
            .should("contain", "MSI GeForce RTX 3060 Gaming X Trio");
          cy.wrap($table).find("button").contains("Show").click();
          checkRowData("CORES", 3584);
          checkRowData("TMUs", 112);
          checkRowData("ROPs", 48);
          checkRowData("VRAM", "12GB GDDR6");
          checkRowData("BUS WIDTH", "192 bit");
          checkRowData("BASE CLOCK", "1320 MHz");
          checkRowData("BOOST CLOCK", "1965 MHz");
          checkRowData("MEMORY CLOCK", "15 Gbps effective");
        });

      cy.get(".gpu-data-table")
        .eq(1)
        .then(($table) => {
          cy.wrap($table)
            .find("thead tr th")
            .should("contain", "MSI GeForce GTX 970 OC");
          cy.wrap($table).find("button").contains("Show").click();
          checkRowData("CORES", 1664);
          checkRowData("TMUs", 104);
          checkRowData("ROPs", 56);
          checkRowData("VRAM", "4GB GDDR5");
          checkRowData("BUS WIDTH", "256 bit");
          checkRowData("BASE CLOCK", "1102 MHz");
          checkRowData("BOOST CLOCK", "1304 MHz");
          checkRowData("MEMORY CLOCK", "7 Gbps effective");
        });

      cy.get(".gpu-data-table")
        .eq(2)
        .then(($table) => {
          cy.wrap($table)
            .find("thead tr th")
            .should("contain", "MSI GeForce GTX 650 OC");
          cy.wrap($table).find("button").contains("Show").click();
          checkRowData("CORES", 384);
          checkRowData("TMUs", 32);
          checkRowData("ROPs", 16);
          checkRowData("VRAM", "1GB GDDR5");
          checkRowData("BUS WIDTH", "128 bit");
          checkRowData("BASE CLOCK", "1084 MHz");
          checkRowData("BOOST CLOCK", "1084 MHz");
          checkRowData("MEMORY CLOCK", "5 Gbps effective");
        });

      cy.get(".gpu-data-table")
        .eq(3)
        .then(($table) => {
          cy.wrap($table)
            .find("thead tr th")
            .should("contain", "NVIDIA RTX PRO 6000 Blackwell");
          cy.wrap($table).find("button").contains("Show").click();
          checkRowData("CORES", 24064);
          checkRowData("TMUs", 752);
          checkRowData("ROPs", 192);
          checkRowData("VRAM", "96GB GDDR7");
          checkRowData("BUS WIDTH", "512 bit");
          checkRowData("BASE CLOCK", "1590 MHz");
          checkRowData("BOOST CLOCK", "2617 MHz");
          checkRowData("MEMORY CLOCK", "28 Gbps effective");
        });
    });
  });

  describe("testing the index", function () {
    beforeEach(function () {
      cy.request("POST", "/api/gpus", {
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "RTX 3060 Gaming X Trio",
        cores: 3584,
        tmus: 112,
        rops: 48,
        vram: 12,
        bus: 192,
        memtype: "GDDR6",
        baseclock: 1320,
        boostclock: 1965,
        memclock: 15,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "GTX 970 OC",
        cores: 1664,
        tmus: 104,
        rops: 56,
        vram: 4,
        bus: 256,
        memtype: "GDDR5",
        baseclock: 1102,
        boostclock: 1304,
        memclock: 7,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "MSI",
        gpuline: "GeForce",
        model: "GTX 650 OC",
        cores: 384,
        tmus: 32,
        rops: 16,
        vram: 1,
        bus: 128,
        memtype: "GDDR5",
        baseclock: 1084,
        boostclock: 1084,
        memclock: 5,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "NVIDIA",
        gpuline: " ",
        model: "RTX PRO 6000 Blackwell",
        cores: 24064,
        tmus: 752,
        rops: 192,
        vram: 96,
        bus: 512,
        memtype: "GDDR7",
        baseclock: 1590,
        boostclock: 2617,
        memclock: 28,
      });

      cy.visit("/");
    });

    it("the index can be shown", function () {
      cy.get("#page-index").find("button").contains("Show index").click();

      cy.get("#page-index").find("button").should("contain", "Hide index");
    });

    it("checking if the graphics cards are present in the index", function () {
      cy.get("#page-index")
        .find("#show-index-button")
        .contains("Show index")
        .click();

      cy.get(".page-index-list li")
        .eq(0)
        .contains("MSI GeForce RTX 3060 Gaming X Trio");

      cy.get(".page-index-list li").eq(1).contains("MSI GeForce GTX 970 OC");

      cy.get(".page-index-list li").eq(2).contains("MSI GeForce GTX 650 OC");

      cy.get(".page-index-list li")
        .eq(3)
        .contains("NVIDIA RTX PRO 6000 Blackwell");
    });

    it("clicking on an index item", function () {
      cy.get("#page-index").find("button").contains("Show index").click();

      indexSelector("MSI GeForce RTX 3060 Gaming X Trio");
    });

    it("the index can be hidden", function () {
      cy.get("#page-index").find("button").contains("Show index").click();

      cy.get("#page-index").find("button").should("contain", "Hide index");

      cy.get("#page-index").find("button").contains("Hide index").click();

      cy.get("#page-index").find("button").should("contain", "Show index");
    });

    it("the back to index button works properly", function () {
      cy.get("#page-index").find("button").contains("Show index").click();

      indexSelector("MSI GeForce RTX 3060 Gaming X Trio");

      cy.get(".gpu-data-table")
        .eq(0)
        .parent()
        .find(".back-to-index-button")
        .click();

      cy.get(".page-index-list").should("be.visible");
    });
  });

  describe("testing the search bar", function () {
    beforeEach(function () {
      cy.request("POST", "/api/gpus", {
        manufacturer: "NVIDIA",
        gpuline: "GeForce",
        model: "RTX 3060",
        cores: 3584,
        tmus: 112,
        rops: 48,
        vram: 12,
        bus: 192,
        memtype: "GDDR6",
        baseclock: 1320,
        boostclock: 1777,
        memclock: 15,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "NVIDIA",
        gpuline: "GeForce",
        model: "GTX 970",
        cores: 1664,
        tmus: 104,
        rops: 56,
        vram: 4,
        bus: 256,
        memtype: "GDDR5",
        baseclock: 1050,
        boostclock: 1178,
        memclock: 7,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "NVIDIA",
        gpuline: "GeForce",
        model: "GTX 650",
        cores: 384,
        tmus: 32,
        rops: 16,
        vram: 1,
        bus: 128,
        memtype: "GDDR5",
        baseclock: 1058,
        boostclock: 1058,
        memclock: 5,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "NVIDIA",
        gpuline: " ",
        model: "RTX PRO 6000 Blackwell",
        cores: 24064,
        tmus: 752,
        rops: 192,
        vram: 96,
        bus: 512,
        memtype: "GDDR7",
        baseclock: 1590,
        boostclock: 2617,
        memclock: 28,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "AMD",
        gpuline: "Radeon",
        model: "RX 9070 XT",
        cores: 4096,
        tmus: 256,
        rops: 128,
        vram: 16,
        bus: 256,
        memtype: "GDDR6",
        baseclock: 1660,
        boostclock: 2970,
        memclock: 20,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "AMD",
        gpuline: "Radeon",
        model: "RX 7900 XTX",
        cores: 6144,
        tmus: 384,
        rops: 192,
        vram: 24,
        bus: 384,
        memtype: "GDDR6",
        baseclock: 1929,
        boostclock: 2498,
        memclock: 20,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "Intel",
        gpuline: "Arc",
        model: "B580",
        cores: 2560,
        tmus: 160,
        rops: 80,
        vram: 12,
        bus: 192,
        memtype: "GDDR6",
        baseclock: 2670,
        boostclock: 2670,
        memclock: 19,
      });

      cy.request("POST", "/api/gpus", {
        manufacturer: "Intel",
        gpuline: "Arc",
        model: "A770",
        cores: 4096,
        tmus: 256,
        rops: 128,
        vram: 16,
        bus: 256,
        memtype: "GDDR6",
        baseclock: 2100,
        boostclock: 2400,
        memclock: 16,
      });

      cy.visit("/");
    });

    it("the search bar can be displayed", function () {
      cy.get("#search-bar-field").find("button").contains("Search").click();

      cy.get("#search-bar-field").find("button").should("contain", "Cancel");
    });

    it("searching for specific manufacturers only", function () {
      cy.get("#search-bar-field").find("button").contains("Search").click();

      // Searches for NVIDIA cards
      cy.get("#search-bar-input").type("nvidia");

      cy.get(".gpu-data-table").should("have.length", 4);

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

      // Searches for AMD Radeon cards
      cy.get("#search-bar-input").clear().type("amd");

      cy.get(".gpu-data-table").should("have.length", 2);

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

      cy.get(".gpu-data-table").should("have.length", 2);

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
      cy.get("#search-bar-field").find("button").contains("Search").click();

      // Searches for NVIDIA GeForce cards
      cy.get("#search-bar-input").type("geforce");

      cy.get(".gpu-data-table").should("have.length", 3);

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

      // Searches for AMD Radeon cards
      cy.get("#search-bar-input").clear().type("radeon");

      cy.get(".gpu-data-table").should("have.length", 2);

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

      cy.get(".gpu-data-table").should("have.length", 2);

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
      cy.get("#search-bar-field").find("button").contains("Search").click();

      cy.get("#search-bar-input").type("rtx");

      cy.get(".gpu-data-table").should("have.length", 2);

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

      cy.get(".gpu-data-table").should("have.length", 1);

      cy.get(".gpu-data-table")
        .eq(0)
        .find("thead tr th")
        .should("contain", "AMD Radeon RX 7900 XTX");

      // Searches by cards that contain a model name with '70'
      cy.get("#search-bar-input").clear().type("70");

      cy.get(".gpu-data-table").should("have.length", 3);

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
      cy.get("#search-bar-field").find("button").contains("Search").click();

      cy.get("#search-bar-input").type("GeForce");

      cy.get("#page-index")
        .find("#show-index-button")
        .contains("Show index")
        .click();

      cy.get(".page-index-list li").eq(0).contains("NVIDIA GeForce RTX 3060");

      cy.get(".page-index-list li").eq(1).contains("NVIDIA GeForce GTX 970");

      cy.get(".page-index-list li").eq(2).contains("NVIDIA GeForce GTX 650");
    });
  });
});
