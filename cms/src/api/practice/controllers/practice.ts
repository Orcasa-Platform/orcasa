/**
 * practice controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::practice.practice', ({ strapi }) => ({
  async filters(ctx) {
    await this.validateQuery(ctx);
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    const result = await strapi
      .service("api::practice.practice")
      .filter(sanitizedQueryParams);

    // land_use_types (array)
    // land_use_prior (array)
    // practice_intervention (one)

    ctx.send(result);
  }
}));
