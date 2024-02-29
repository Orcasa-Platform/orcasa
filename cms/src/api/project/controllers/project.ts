/**
 * project controller
 */

import { factories } from '@strapi/strapi'
import { env } from "@strapi/utils";

export default factories.createCoreController('api::project.project', () => ({
  async map(ctx) {
    ctx.request.query.pagination = {
      page: 1,
      pageSize: 9999999999,
    }
    ctx.request.query.populate = { 'country_of_interventions': { fields: ['id'] } }
    ctx.request.query.fields = ['name']
    ctx.query.filters = { ...ctx.query.filters, publication_status: { $eq: 'accepted' } }

    const { data } = await super.find(ctx);

    return data.map((result) => ({
      id: result.id,
      name: result.attributes.name,
      countries: result.attributes.country_of_interventions?.data?.map((country) => (country.id))
    }));
  },

  async find(ctx) {
    ctx.query.filters = { ...ctx.query.filters, publication_status: { $eq: 'accepted' } }

    return await super.find(ctx);
  },

  async create(ctx) {
    if (ctx.request.body.data.publication_status) {
      return ctx.forbidden();
    }

    ctx.request.body.data.publication_status = "proposed"

    const response = await super.create(ctx);

    const networkSuggestion: any = await strapi.entityService.findMany('api::network-suggestion.network-suggestion');
    if (networkSuggestion?.new_suggestion_email_recipients) {
      strapi.log.info(`Sending project suggestion creation email to: ${networkSuggestion.new_suggestion_email_recipients}`);
      await strapi.plugins['email'].services.email.send({
        bcc: networkSuggestion.new_suggestion_email_recipients,
        subject:  `Impact4Soil - Network - New Project suggestion "${response.data.attributes.name}", ID: ${response.data.id}` ,
        text: `New Project suggestion created. You may review the details via the following link: ${env('CMS_URL')}admin/content-manager/collection-types/api::project.project/${response.data.id}.`,
        html: `<h3>New Project suggestion created</h3>
             <p> You may review the details via the following link: <a target="_blank" href="${env('CMS_URL')}admin/content-manager/collection-types/api::project.project/${response.data.id}">Review Project</a></p>`
      });
    }

    return response;
  }
}));
