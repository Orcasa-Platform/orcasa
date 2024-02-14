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

    if (practiceIntervention === 'Land Use Change' && data.land_use_priors.connect.length === 0) {
      throw new ApplicationError('Practice Intervention of type Land Use Change must have Land Use Priors set');
    }

    if (practiceIntervention === 'Management' && data.subinterventions.connect.length === 0) {
      throw new ApplicationError('Practice Intervention of type Management must have Subinterventions set');
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    const practice: any = await strapi.entityService.findOne("api::practice.practice", event.params.where.id, {
      populate: { subinterventions: true, land_use_priors: true },
    });

    const published: boolean = ('publishedAt' in data) ? data.publishedAt !== null : practice.publishedAt !== null;
    const practiceIntervention: string = ('practice_intervention' in data) ? data.practice_intervention : practice.practice_intervention;

    const numberOfLandUsePriorsAfterUpdate = ((practice.land_use_priors ?? []).length) + ((data.land_use_priors.connect ?? []).length) - ((data.land_use_priors.disconnect ?? []).length);
    const numberOfSubinterventionsAfterUpdate = ((practice.subinterventions ?? []).length) + ((data.subinterventions.connect ?? []).length) - ((data.subinterventions.disconnect ?? []).length);

    if (published && practiceIntervention === 'None') {
      throw new ApplicationError('Published practices must have Practice Intervention set');
    }

    if ((data.practice_intervention === 'Land Use Change' || (!data.practice_intervention && practice.practice_intervention === 'Land Use Change'))  && numberOfLandUsePriorsAfterUpdate === 0
    ) {
      throw new ApplicationError('Practice Intervention of type Land Use Change must have Land Use Priors set');
    }

    if ((data.practice_intervention === 'Management' || (!data.practice_intervention && practice.practice_intervention === 'Management'))  && numberOfSubinterventionsAfterUpdate === 0
    ) {
      throw new ApplicationError('Practice Intervention of type Management must have Subinterventions set');
    }

  },
};
