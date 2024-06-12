import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'rogzqd',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1500,
    viewportHeight: 960,
    // baseUrl: 'https://archway.finance/'
  },
});
