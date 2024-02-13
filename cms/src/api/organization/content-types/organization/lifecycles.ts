import { errors } from "@strapi/utils";

const { ApplicationError } = errors;

export default {
  beforeCreate(event) {
    const organizationDelta = event.params.data;

    if (organizationDelta.organization_type.connect.length === 0) {
      throw new ApplicationError('Organization Type is required');
    }
    if (organizationDelta.main_organization_theme.connect.length === 0) {
      throw new ApplicationError('Main Organization Theme is required');
    }
    if (organizationDelta.country.connect.length === 0) {
      throw new ApplicationError('Country is required');
    }
  },
  async beforeUpdate(event) {
    const organizationDelta = event.params.data;
    const organizationToUpdate: any = await strapi.entityService.findOne("api::organization.organization", event.params.where.id);

    if (organizationDelta.organization_type.connect.length === 0 && (organizationDelta.organization_type.disconnect.length === 1 || !organizationToUpdate.organization_type)) {
      throw new ApplicationError('Organization Type is required');
    }
    if (organizationDelta.main_organization_theme.connect.length === 0 && (organizationDelta.main_organization_theme.disconnect.length === 1 || !organizationToUpdate.main_organization_theme)) {
      throw new ApplicationError('Main Organization Theme is required');
    }
    if (organizationDelta.country.connect.length === 0 && (organizationDelta.country.disconnect.length === 1 || !organizationToUpdate.country)) {
      throw new ApplicationError('Country is required');
    }
  },
}
