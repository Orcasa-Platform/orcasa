export default {
  /**
   * Once a month, run WOCAT importer
   */

  wocatImporter: {
    task: async ({ strapi }) => {
      await strapi.plugin('orcasa').service('practiceImportService').import();
    },
    options: {
      rule: "0 0 1 1 * *",
    },
  },
};
