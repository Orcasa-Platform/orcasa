import { env, errors } from "@strapi/utils";

const { ApplicationError } = errors;

export default {
  beforeCreate(event) {
    const organizationDelta = event.params.data;

    const organizationTypeConnected = (organizationDelta.organization_type.connect && organizationDelta.organization_type.connect.length > 0);
    const organizationTypeSentAsString = (organizationDelta.organization_type && typeof organizationDelta.organization_type === 'string');

    const organizationThemeConnected = (organizationDelta.main_organization_theme.connect && organizationDelta.main_organization_theme.connect.length > 0);
    const organizationThemeSentAsStrings = (organizationDelta.main_organization_theme && typeof organizationDelta.main_organization_theme === 'string');

    const countryConnected = (organizationDelta.country.connect && organizationDelta.country.connect.length > 0);
    const countrySentAsStrings = (organizationDelta.country && typeof organizationDelta.country === 'string');

    if (!organizationTypeConnected && !organizationTypeSentAsString) {
      throw new ApplicationError('Organization Type is required');
    }
    if (!organizationThemeConnected && !organizationThemeSentAsStrings) {
      throw new ApplicationError('Main Organization Theme is required');
    }
    if (!countryConnected && !countrySentAsStrings) {
      throw new ApplicationError('Country is required');
    }
  },
  async beforeUpdate(event) {
    const organizationDelta = event.params.data;
    const organizationToUpdate: any = await strapi.entityService.findOne("api::organization.organization", event.params.where.id, { populate: ['organization_type', 'main_organization_theme', 'country'] });

    if (organizationDelta.organization_type.connect.length === 0 && (organizationDelta.organization_type.disconnect.length === 1 || !organizationToUpdate.organization_type)) {
      throw new ApplicationError('Organization Type is required');
    }
    if (organizationDelta.main_organization_theme.connect.length === 0 && (organizationDelta.main_organization_theme.disconnect.length === 1 || !organizationToUpdate.main_organization_theme)) {
      throw new ApplicationError('Main Organization Theme is required');
    }
    if (organizationDelta.country.connect.length === 0 && (organizationDelta.country.disconnect.length === 1 || !organizationToUpdate.country)) {
      throw new ApplicationError('Country is required');
    }
  }
}
