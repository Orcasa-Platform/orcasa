module.exports = ({ strapi }) => ({
  async import(ctx) {
    return await strapi.plugin('orcasa').service('practiceImportService').import();
  },

  async decorate(ctx) {
    return await strapi.plugin('orcasa').service('practiceImportService').decorate();
  },
});
