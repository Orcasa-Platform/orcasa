/**
 * project controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::project.project', () => ({
  async map(ctx) {
    ctx.request.query.pagination = {
      page: 1,
      pageSize: 9999999999,
    }
    ctx.request.query.populate = { 'country_of_interventions': { fields: ['id'] } }
    ctx.request.query.fields = ['name']

    const { data } = await super.find(ctx);

    return data.map((result) => ({id: result.id, name: result.attributes.name, countries: result.attributes.country_of_interventions.data.map((country) => (country.id))}));
  },

  async find(ctx) {
    ctx.query = { ...ctx.query, publication_status: 'accepted' }

    return await super.find(ctx);
  },

  async create(ctx) {
    if (ctx.request.body.data.publication_status) {
      return ctx.forbidden();
    }

    ctx.request.body.data.publication_status = "proposed"

    return await super.create(ctx);
  }
}));
