import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

export default class PracticeDecorator<T extends { source_id: string }, D extends T> {

  private async loadDecoratorJson(jsonURL: string): Promise<Record<string, any>> {
    strapi.log.info(`Practices import - getting decorator JSON from ${jsonURL}`);
    const decoratorJSONRequestConfig: AxiosRequestConfig = {
      method: 'GET',
      url: jsonURL,
      headers: {
        'Accept': 'application/json'
      }
    };
    const decoratorJSONResponse: AxiosResponse<Record<string, any>> = await axios(decoratorJSONRequestConfig);

    const decoratorMap: Record<string, Record<string, any>> = {}

    for (let decorator of (decoratorJSONResponse.data as Array<Record<string, any>>)) {
      decoratorMap[decorator.code] = _.omitBy(decorator, _.isNull);
      delete decoratorMap[decorator.code].code;
    }

    return decoratorMap;
  }


  async decoratePractices(practices: Array<T>): Promise<Array<D>> {
    const decoratorJson = await this.loadDecoratorJson('https://gist.githubusercontent.com/tiagojsag/e77fade4ff5a59547508a59ae9257253/raw/7c908467154011c9dc8a773d5f4897f51ba7ee40/decorator.json');

    return Promise.all(practices.map(async (practice: Record<string, any>) => {
      if (!decoratorJson[practice.source_id]) {
        return (practice as D);
      }

      const decoratedPractice: Record<string, any> = { };

      if (decoratorJson[practice.source_id].land_use_prior) {
        const land_use_prior = (await strapi.entityService.findMany(
          'api::land-use-type.land-use-type',
          {
            filters: { name: { $in: decoratorJson[practice.source_id].land_use_prior } },
          }
        ));

        decoratedPractice.land_use_prior = land_use_prior;
      }

      if (decoratorJson[practice.source_id].land_use_types) {
        const land_use_types = (await strapi.entityService.findMany(
          'api::land-use-type.land-use-type',
          {
            filters: { name: { $in: decoratorJson[practice.source_id].land_use_types } },
          }
        ));

        decoratedPractice.land_use_types = land_use_types;
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

      return decoratedPractice as D;
    }));


  }

  async decorate(): Promise<Array<D>> {
    const practices: Array<Record<string, any>> = await strapi.entityService.findMany('api::practice.practice', {
      populate: ['country', 'land_use_prior', 'land_use_types', 'practice_intervention'],
    });

    return this.decoratePractices(practices as T[]);
  }
}

