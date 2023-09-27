'use strict';

module.exports = ({ strapi }) => ({
  async acceptChange(ctx) {
    const projectChangeId = ctx.params.id;

    if (!hasPermissions(ctx)) {
      return ctx.forbidden();
    }

    try {
      const projectChange = await strapi.entityService.findOne('api::project-change.project-change', projectChangeId, { populate: '*' });
      if (!projectChange) {
        return ctx.notFound();
      }

      const projectId = projectChange.related_project.id;

      const project = await strapi.entityService.findOne('api::project.project', projectId);
      if (!project) {
        return ctx.notFound();
      }

      delete projectChange.id;
      delete projectChange.status;
      delete projectChange.createdAt;
      delete projectChange.createdBy;
      delete projectChange.updatedAt;
      delete projectChange.updatedBy;
      delete projectChange.related_project;

      let filteredProjectChange = Object.fromEntries(Object.entries(projectChange).filter(([_, v]) => (!Array.isArray(v) && v !== null) || (Array.isArray(v) && v.length > 0)));

      const model = strapi.getModel('api::project.project');
      const validData = await strapi.entityValidator.validateEntityUpdate(model, filteredProjectChange)

      const updatedProject = await strapi.entityService.update('api::project.project', projectId, {
        data: validData
      });

      await strapi.entityService.update('api::project-change.project-change', ctx.params.id, {
        data: {
          status: 'accepted'
        }
      });

      ctx.body = updatedProject;
    } catch (err) {
      ctx.body = err;
      ctx.status = 500;
    }
  },

  async declineChange(ctx) {
    if (!hasPermissions(ctx)) {
      return ctx.forbidden();
    }

    try {
      const projectChange = await strapi.entityService.findOne('api::project-change.project-change', ctx.params.id);
      if (!projectChange) {
        return ctx.notFound();
      }

      const updatedProjectChange = await strapi.entityService.update('api::project-change.project-change', ctx.params.id, {
        data: {
          status: 'declined'
        }
      });
      ctx.body = updatedProjectChange;
    } catch (err) {
      ctx.body = err;
    }
  },
});

const hasPermissions = (ctx) => {
  const { userAbility } = ctx.state;

  const permissionChecker = strapi.plugin('content-manager').service('permission-checker').create({
    userAbility,
    model: 'api::project-change.project-change'
  });
  return permissionChecker.can.update();
};

