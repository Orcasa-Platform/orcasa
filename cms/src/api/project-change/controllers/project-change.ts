/**
 * project-change controller
 */


const { createCoreController } = require('@strapi/strapi').factories;

export default createCoreController('api::project-change.project-change', ({ strapi }) =>  ({

  async acceptChange(ctx) {
    ctx.body = 'todo';
    // try {
    //   // const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    //
    //   // const projectChange = await strapi.entityService.findOne('api::project-change.project-change', ctx.params.id);
    //
    //   console.log("HEEEEEEEEEEEEEEEEEEEREEE");
    //   // const project = await strapi.entityService.create('api::project.project', {
    //   //   data: {
    //   //     ...projectChange
    //   //   },
    //   // });
    //
    //   ctx.body = 'ok';
    // } catch (err) {
    //   ctx.body = err;
    // }
  },
}));
