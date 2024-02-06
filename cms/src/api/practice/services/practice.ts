import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::practice.practice', ({ strapi }) => ({
  async filter(...args: any[]): Promise<any> {

    let landUseTypes = [];
    let landUsePrior = [];
    let practiceIntervention = [];

    let practiceFilters: Record<string, any> = { $and: [] };

    if (args[0].filters.land_use_types) {
      landUseTypes = await strapi.entityService.findMany('api::land-use-type.land-use-type', {
        fields: ['id'],
        filters: { name: args[0].filters.land_use_types }
      });

      practiceFilters['$and'].push({ land_use_types : { id: {$in: Object.values(landUseTypes).map(result => result.id) } } });
    }

    if (args[0].filters.land_use_prior) {
      landUsePrior = await strapi.entityService.findMany('api::land-use-type.land-use-type', {
        fields: ['id'],
        filters: { name: args[0].filters.land_use_prior }
      });

      practiceFilters['$and'].push({ land_use_prior : { id: {$in: Object.values(landUsePrior).map(result => result.id) } } });
    }

    if (args[0].filters.practice_intervention) {
      practiceIntervention = await strapi.entityService.findMany('api::practice-intervention.practice-intervention', {
        fields: ['id'],
        filters: { name: args[0].filters.practice_intervention }
      });

      practiceFilters['$and'].push({ practice_intervention : { id: {$in: Object.values(practiceIntervention).map(result => result.id) } } });
    }

    const results = await strapi.entityService.findMany('api::practice.practice', {
      filters: practiceFilters,
      populate: ['land_use_types', 'land_use_prior', 'practice_intervention', 'subinterventions'],
    })

    return results;
  },
}));
