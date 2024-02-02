const axios = require('axios');
const _ = require('lodash');

module.exports = class WocatPracticeDecorator {

  async loadDecoratorJson(jsonURL) {
    strapi.log.info(`Practices import - getting decorator JSON from ${jsonURL}`);
    const decoratorJSONRequestConfig = {
      method: 'GET',
      url: jsonURL,
      headers: {
        'Accept': 'application/json'
      }
    };
    const decoratorJSONResponse = await axios(decoratorJSONRequestConfig);

    const decoratorMap = {}

    for (let decorator of decoratorJSONResponse.data) {
      decoratorMap[decorator.code] = _.omitBy(decorator, _.isNull);
      delete decoratorMap[decorator.code].code;
    }

    return decoratorMap;
  }


  async decoratePractices(practices) {
    const decoratorJson = await this.loadDecoratorJson('https://gist.githubusercontent.com/tiagojsag/e77fade4ff5a59547508a59ae9257253/raw/7c908467154011c9dc8a773d5f4897f51ba7ee40/decorator.json');

    return Promise.all(practices.map(async (practice) => {
      if (!decoratorJson[practice.source_id]) {
        return practice;
      }

      const decoratedPractice = {};

      if (decoratorJson[practice.source_id].land_use_prior) {
        decoratedPractice.land_use_prior = (await strapi.entityService.findMany(
          'api::land-use-type.land-use-type',
          {
            filters: { name: { $in: decoratorJson[practice.source_id].land_use_prior } },
          }
        ));
      }

      if (decoratorJson[practice.source_id].land_use_types) {
        decoratedPractice.land_use_types = (await strapi.entityService.findMany(
          'api::land-use-type.land-use-type',
          {
            filters: { name: { $in: decoratorJson[practice.source_id].land_use_types } },
          }
        ));
      }

      if (decoratorJson[practice.source_id].intervention) {
        const practice_intervention = (await strapi.entityService.findMany(
          'api::practice-intervention.practice-intervention',
          {
            filters: { slug: decoratorJson[practice.source_id].intervention },
          }
        ));

        decoratedPractice.practice_intervention = practice_intervention[0];
      }

      if (decoratorJson[practice.source_id].sub_intervention) {
        decoratedPractice.sub_intervention = decoratorJson[practice.source_id].sub_intervention.join(';');
      }
      if ('show' in decoratorJson[practice.source_id]) {
        decoratedPractice.show = decoratorJson[practice.source_id].show;
      }

      await strapi.entityService.update('api::practice.practice', practice.id, {
        data: decoratedPractice,
      });

      return decoratedPractice;
    }));


  }

  async decorate() {
    const practices = await strapi.entityService.findMany('api::practice.practice', {
      populate: ['country', 'land_use_prior', 'land_use_types', 'practice_intervention'],
    });

    return this.decoratePractices(practices);
  }
}

