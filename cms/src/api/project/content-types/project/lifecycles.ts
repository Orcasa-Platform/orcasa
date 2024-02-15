import { env, errors } from "@strapi/utils";

const { ApplicationError } = errors;

export default {

  beforeCreate(event) {
    const projectDelta = event.params.data;

    if (projectDelta.project_type.connect.length === 0) {
      throw new ApplicationError('Project Type is required');
    }
    if (projectDelta.lead_partner.connect.length === 0) {
      throw new ApplicationError('Lead Partner is required');
    }
    if (projectDelta.country_of_coordination.connect.length === 0) {
      throw new ApplicationError('Country of Coordination is required');
    }
  },
  async beforeUpdate(event) {
    const projectToUpdate: any = await strapi.entityService.findOne("api::project.project", event.params.where.id, { populate: ['project_type', 'lead_partner', 'country_of_coordination'] });
    const projectDelta = event.params.data;

    if (projectDelta.project_type.connect.length === 0 && (projectDelta.project_type.disconnect.length === 1 || !projectToUpdate.project_type)) {
      throw new ApplicationError('Project Type is required');
    }
    if (projectDelta.lead_partner.connect.length === 0 && (projectDelta.lead_partner.disconnect.length === 1 || !projectToUpdate.lead_partner)) {
      throw new ApplicationError('Lead Partner is required');
    }
    if (projectDelta.country_of_coordination.connect.length === 0 && (projectDelta.country_of_coordination.disconnect.length === 1 || !projectToUpdate.country_of_coordination)) {
      throw new ApplicationError('Country of Coordination is required');
    }
  },

  async afterCreate(event) {
    const { result, params  } = event;
    const notificationEmails: any = await strapi.entityService.findMany('api::notification-email.notification-email');
    const emailPromises = [];

    for (const email of notificationEmails.notification_email.split(',')) {
      emailPromises.push(
        strapi.plugins['email'].services.email.send({
          to: email,
          subject:  `Impact4Soil - Network - New Project suggestion "${params.data.name}", ID: ${result.id}` ,
          text: env('CMS_URL') + `/admin/content-manager/collection-types/api::project.project/${result.id}`
        })
      );
    }
    await Promise.all(emailPromises);
  }


}


