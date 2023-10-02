/**
 * organization controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::organization.organization', () => ({
  async map(ctx) {
    ctx.request.query.pagination = {
      page: 1,
      pageSize: 9999999999,
    }
    ctx.request.query.populate = { 'country': { fields: ['id'] } }
    ctx.request.query.fields = ['name']

    const { data } = await super.find(ctx);
    // some more logic

    return data.map((result) => ({id: result.id, name: result.attributes.name, country: result.attributes.country.data.id}));
  },
}));
