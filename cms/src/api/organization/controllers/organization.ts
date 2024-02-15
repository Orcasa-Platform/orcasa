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
    ctx.query.filters = { ...ctx.query.filters, publication_status: { $eq: 'accepted' } }

    return await super.find(ctx);
  },

  async create(ctx) {
    if (ctx.request.body.data.publication_status) {
      return ctx.forbidden();
    }

    ctx.request.body.data.publication_status = "proposed"

    const response = await super.create(ctx);

    const notificationEmails: any = await strapi.entityService.findMany('api::notification-email.notification-email');
    await strapi.plugins['email'].services.email.send({
      bcc: notificationEmails.notification_email,
      subject:  `Impact4Soil - Network - New Organization suggestion "${response.data.attributes.name}", ID: ${response.data.id}` ,
      text: `<h3>New Organization suggestion created</h3>
             <p> You may review the details via the following link: <a href="${env('CMS_URL')}/admin/content-manager/collection-types/api::organization.organization/${response.data.id}">Review Organization</a></p>`
    });

    return response;
  }
}));
