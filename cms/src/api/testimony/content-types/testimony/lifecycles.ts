import { errors } from "@strapi/utils";

const { ApplicationError } = errors;

export default {
  beforeCreate(event) {
    const { country } = event.params.data;

    if (country?.connect?.length === 0 && typeof country !== 'string') {
      throw new ApplicationError('Country is required');
    }
  },
  async beforeUpdate(event) {
    const { country } = event.params.data;
    const testimonyToUpdate = await strapi.entityService.findOne("api::testimony.testimony", event.params.where.id, { populate: ['country'] });

    if (country?.connect?.length === 0 && (country?.disconnect?.length === 1 || !testimonyToUpdate.country)) {
      throw new ApplicationError('Country is required');
    }
  }
}
