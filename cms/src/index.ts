import { errors } from "@strapi/utils";

const { ApplicationError } = errors;

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      model: 'api::organization.organization',
      beforeCreate(event) {
        const organizationDelta = event.params.data;

        if (organizationDelta.organization_type.connect.length === 0) {
          throw new ApplicationError('Organization Type is required');
        }
      },
      beforeUpdate(event) {
        const organizationDelta = event.params.data;

        if (organizationDelta.organization_type.disconnect.length === 1 && organizationDelta.organization_type.connect.length === 0) {
          throw new ApplicationError('Organization Type is required');
        }
      },
    });
  }
}
