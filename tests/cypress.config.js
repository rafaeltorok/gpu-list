const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
    baseUrl: process.env.CYPRESS_FRONTEND || "http://localhost:5173",
    env: {
      BACKEND: process.env.CYPRESS_BACKEND || "http://localhost:3001",
    },
  },
});
