module.exports = ({ strapi }) => ({
  async acceptChange(ctx) {
    // ctx.body = 'todo';
    try {
      const organizationChange = await strapi.entityService.findOne('api::organization-change.organization-change', ctx.params.id);

      delete organizationChange.id;

      const organization = await strapi.entityService.create('api::organization.organization', {
        data: {
          ...organizationChange,
          publication_status: 'accepted',
        },
      });

      await strapi.entityService.update('api::organization-change.organization-change', ctx.params.id, {
        data: {
          publication_status: 'accepted',
        },
      });

      ctx.body = organization;
    } catch (err) {
      ctx.body = err;
    }
  },

  async declineChange(ctx) {
    try {
      const organizationChange = await strapi.entityService.update('api::organization-change.organization-change', ctx.params.id, {
        data: {
          publication_status: 'declined',
        },
      });

      ctx.body = organizationChange;
    } catch (err) {
      ctx.body = err;
    }
  }
});
