import { env, errors } from "@strapi/utils";

const { ApplicationError } = errors;

export default {
  beforeCreate(event) {
    const { organization_type, main_organization_theme, country } = event.params.data;

    if (!(organization_type.connect?.length > 0) && !(typeof organization_type === 'string')) {
      throw new ApplicationError('Organization Type is required');
    }
    if (!(main_organization_theme.connect?.length > 0) && !(typeof main_organization_theme === 'string')) {
      throw new ApplicationError('Main Organization Theme is required');
    }
    if (!(country.connect?.length > 0) && !(typeof country === 'string')) {
      throw new ApplicationError('Country is required');
    }
  },
  async beforeUpdate(event) {
    const { project_type, lead_partner, country_of_coordination } = event.params.data;
    const projectToUpdate = await strapi.entityService.findOne("api::project.project", event.params.where.id, {
      populate: ['project_type', 'lead_partner', 'country_of_coordination']
    });

    if (project_type.connect.length === 0 && (project_type.disconnect.length === 1 || !projectToUpdate.project_type)) {
      throw new ApplicationError('Project Type is required');
    }
    if (lead_partner.connect.length === 0 && (lead_partner.disconnect?.length === 1 || !projectToUpdate.lead_partner)) {
      throw new ApplicationError('Lead Partner is required');
    }
    if (country_of_coordination.connect.length === 0 && (country_of_coordination?.disconnect?.length === 1 || !projectToUpdate.country_of_coordination)) {
      throw new ApplicationError('Country of Coordination is required');
    }
  }
}
