import { errors } from "@strapi/utils";

const { ApplicationError } = errors;

export default {
  beforeCreate(event) {
    const { organization_type, main_organization_theme, country } = event.params.data;

    if (organization_type?.connect?.length === 0 && typeof organization_type !== 'string') {
      throw new ApplicationError('Organization Type is required');
    }
    if (main_organization_theme?.connect?.length === 0 && typeof main_organization_theme !== 'string') {
      throw new ApplicationError('Main Organization Theme is required');
    }
    if (country?.connect?.length === 0 && typeof country !== 'string') {
      throw new ApplicationError('Country is required');
    }
  },
  async beforeUpdate(event) {
    const { organization_type, main_organization_theme, country } = event.params.data;

    const organizationToUpdate: any = await strapi.db.query("api::organization.organization").findOne({
      where: event.params.where,
      populate: ['organization_type', 'main_organization_theme', 'country']
    });

    if (organization_type?.connect?.length === 0 && (organization_type?.disconnect?.length === 1 || !organizationToUpdate.organization_type)) {
      throw new ApplicationError('Organization Type is required');
    }
    if (main_organization_theme?.connect?.length === 0 && (main_organization_theme?.disconnect?.length === 1 || !organizationToUpdate.main_organization_theme)) {
      throw new ApplicationError('Main Organization Theme is required');
    }
    if (country?.connect?.length === 0 && (country?.disconnect?.length === 1 || !organizationToUpdate.country)) {
      throw new ApplicationError('Country is required');
    }
  }
}
