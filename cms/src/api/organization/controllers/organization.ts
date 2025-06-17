/**
 * organization controller
 */

import { factories } from '@strapi/strapi'
import { env } from "@strapi/utils";

export default factories.createCoreController('api::organization.organization', () => ({
  async map(ctx) {
    ctx.request.query.pagination = {
      page: 1,
      pageSize: 9999999999,
    }
    ctx.request.query.populate = { 'country': { fields: ['id'] } }
    ctx.request.query.fields = ['name']
    ctx.query.filters = { ...ctx.query.filters, publication_status: { $eq: 'accepted' } }

    const { data } = await super.find(ctx);

    return data.map((result) => ({
      id: result.id,
      name: result.attributes.name,
      country: result.attributes.country?.data?.id
    }));
  },

  async find(ctx) {
    // Only allow to search for the organizations with the proposed status if we don't retrieve their attributes. This
    // can be useful to determine if one already exists with a specific name.
    // It is not totally safe though as the filters can be used to guess the attributes by brute-force.
    const canSearchProposedStatus = ctx.query.fields !== undefined && ctx.query.fields !== null
      && ctx.query.fields.length === 1 && ctx.query.fields[0] === 'id';

    ctx.query.filters = {
      ...ctx.query.filters,
      ...(canSearchProposedStatus ? {} : { publication_status: { $eq: 'accepted' } }),
    };

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
      strapi.log.info(`Sending organization suggestion creation email to: ${networkSuggestion.new_suggestion_email_recipients}`);
      await strapi.plugins['email'].services.email.send({
        bcc: networkSuggestion.new_suggestion_email_recipients,
        subject: `Impact4Soil - Network - New Organization suggestion "${response.data.attributes.name}", ID: ${response.data.id}`,
        text: `New Organization suggestion created. You may review the details via the following link: ${env("CMS_URL")}admin/content-manager/collection-types/api::organization.organization/${response.data.id}`,
        html: `<h3>New Organization suggestion created</h3>
             <p> You may review the details via the following link: <a target="_blank" href="${env('CMS_URL')}admin/content-manager/collection-types/api::organization.organization/${response.data.id}">Review Organization</a></p>`
      });
    }

    return response;
  }
}));
