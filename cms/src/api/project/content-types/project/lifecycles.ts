import { errors } from "@strapi/utils";

const { ApplicationError } = errors;

export default {
  beforeCreate(event) {
    const { project_type, lead_partner, country_of_coordination, project_coordinator_email, project_coordinator_website } = event.params.data;

    if (project_type?.connect?.length === 0 && typeof project_type !== 'string') {
      throw new ApplicationError('Project Type is required');
    }
    if (lead_partner?.connect?.length === 0 && typeof lead_partner !== 'string') {
      throw new ApplicationError('Lead Partner is required');
    }
    if (country_of_coordination?.connect?.length === 0 && typeof country_of_coordination !== 'string') {
      throw new ApplicationError('Country of Coordination is required');
    }

    if (project_coordinator_email && project_coordinator_website) {
      throw new ApplicationError('You should not provide Project Coordinator Email and Project Coordinator Website simultaneously.');
    }
  },
  async beforeUpdate(event) {
    const { project_type, lead_partner, country_of_coordination, project_coordinator_email, project_coordinator_website } = event.params.data;
    const projectToUpdate = await strapi.entityService.findOne("api::project.project", event.params.where.id, {
      populate: ['project_type', 'lead_partner', 'country_of_coordination']
    });

    if (project_type?.connect?.length === 0 && (project_type?.disconnect?.length === 1 || !projectToUpdate.project_type)) {
      throw new ApplicationError('Project Type is required');
    }
    if (lead_partner?.connect?.length === 0 && (lead_partner?.disconnect?.length === 1 || !projectToUpdate.lead_partner)) {
      throw new ApplicationError('Lead Partner is required');
    }
    if (country_of_coordination?.connect?.length === 0 && (country_of_coordination?.disconnect?.length === 1 || !projectToUpdate.country_of_coordination)) {
      throw new ApplicationError('Country of Coordination is required');
    }

    if (project_coordinator_email && project_coordinator_website) {
      throw new ApplicationError('You should not provide Project Coordinator Email and Project Coordinator Website simultaneously.');
    }
  }
}


