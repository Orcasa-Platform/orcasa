module.exports = ({ strapi }) => ({
  async acceptChange(ctx) {
    // ctx.body = 'todo';
    try {
      const projectChange = await strapi.entityService.findOne('api::project-change.project-change', ctx.params.id);

      delete projectChange.id;

      const project = await strapi.entityService.create('api::project.project', {
        data: {
          ...projectChange,
        },
      });

      await strapi.entityService.update('api::project-change.project-change', ctx.params.id, {
        data: {
          publication_status: 'accepted',
        },
      });

      ctx.body = project;
    } catch (err) {
      ctx.body = err;
    }
  },

  async declineChange(ctx) {
    try {
      const projectChange = await strapi.entityService.update('api::project-change.project-change', ctx.params.id, {
        data: {
          publication_status: 'declined',
        },
      });

      ctx.body = projectChange;
    } catch (err) {
      ctx.body = err;
    }
  }
});
