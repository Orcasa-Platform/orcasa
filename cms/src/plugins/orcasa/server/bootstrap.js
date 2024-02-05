'use strict';

module.exports = async ({ strapi }) => {
  // Register permission actions.
  const actions = [
    {
      section: 'plugins',
      displayName: 'Allow accepting project changes',
      uid: 'project.accept-changes',
      pluginName: 'orcasa',
    },
    {
      section: 'plugins',
      displayName: 'Allow declining project changes',
      uid: 'project.decline-changes',
      pluginName: 'orcasa',
    },
    {
      section: 'plugins',
      displayName: 'Allow accepting organization changes',
      uid: 'organization.accept-changes',
      pluginName: 'orcasa',
    },
    {
      section: 'plugins',
      displayName: 'Allow declining organization changes',
      uid: 'organization.decline-changes',
      pluginName: 'orcasa',
    },
    {
      section: 'plugins',
      displayName: 'Allow importing practices',
      uid: 'practices.import',
      pluginName: 'orcasa',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
