import { errors } from "@strapi/utils";

const { ApplicationError } = errors;

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    const published: boolean = ('publishedAt' in data) ? data.publishedAt !== null : false;
    const practiceIntervention: string = ('practice_intervention' in data) ? data.practice_intervention : 'None';

    if (published && practiceIntervention === 'None') {
      throw new ApplicationError('Published practices must have Practice Intervention set');
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;
    const practice = await strapi.entityService.findOne("api::practice.practice", event.params.where.id);

    const published: boolean = ('publishedAt' in data) ? data.publishedAt !== null : practice.publishedAt !== null;
    const practiceIntervention: string = ('practice_intervention' in data) ? data.practice_intervention : practice.practice_intervention;

    if (published && practiceIntervention === 'None') {
      throw new ApplicationError('Published practices must have Practice Intervention set');
    }
  },
};
