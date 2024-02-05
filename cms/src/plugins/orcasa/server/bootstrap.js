'use strict';

module.exports = async ({ strapi }) => {
  // Register permission actions.
  const actions = [
    {
      section: 'plugins',
      displayName: 'Allow importing practices',
      uid: 'practices.import',
      pluginName: 'orcasa',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
