const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Set environment variables dynamically
      config.env.API_URL = 'http://localhost:4000/api/v1';
      
      return config; 
    },
  },
});
