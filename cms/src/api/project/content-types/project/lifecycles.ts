import { errors } from "@strapi/utils";

const { ApplicationError } = errors;

export default {

  beforeCreate(event) {
    const projectDelta = event.params.data;

    if (projectDelta.project_type.connect.length === 0) {
      throw new ApplicationError('Project Type is required');
    }
    if (projectDelta.lead_partner.connect.length === 0) {
      throw new ApplicationError('Main Organization Theme is required');
    }
    if (projectDelta.country_of_coordination.connect.length === 0) {
      throw new ApplicationError('Country is required');
    }
  },
  async beforeUpdate(event) {
    const projectToUpdate: any = await strapi.entityService.findOne("api::project.project", event.params.where.id);
    const projectDelta = event.params.data;

    if ((!projectToUpdate.project_type && projectDelta.project_type.connect.length === 0) || (projectDelta.project_type.disconnect.length === 1 && projectDelta.project_type.connect.length === 0)) {
      throw new ApplicationError('Project Type is required');
    }
    if ((!projectToUpdate.lead_partner && projectDelta.lead_partner.connect.length === 0) ||(projectDelta.lead_partner.disconnect.length === 1 && projectDelta.lead_partner.connect.length === 0)) {
      throw new ApplicationError('Lead Partner is required');
    }
    if ((!projectToUpdate.country_of_coordination && projectDelta.country_of_coordination.connect.length === 0) || (projectDelta.country_of_coordination.disconnect.length === 1 && projectDelta.country_of_coordination.connect.length === 0)) {
      throw new ApplicationError('Country of Coordination is required');
    }
  }
}


