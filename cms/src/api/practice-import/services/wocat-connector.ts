import { get, isEmpty, range, reject } from "lodash";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type Questionnaire = {
  code: string;
  title: string;
  translations: Array<[string, string]>;
  section_specifications: {
    children: {
      tech__2: {
        children: {
          tech__2__5: {
            children: {
              qg_location: {
                children: {
                  country: {
                    value: Array<{ value: string }>;
                  }
                }
              }
            }
          },
          tech__2__2: {
            children: {
              tech_qg_2: {
                children: {
                  tech_description: {
                    value: Array<{ value: string }>;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export type WocatPractice = {
  source_name: "WOCAT",
  source_id: string,

  title: string,
  practice_url: string,

  short_description: string,
  detailed_description: string,
  project_fund: string,
  institution_funding: string,
  country: string,
  state_province: string,
  further_location: string,
  map_location: string,
  implem_date: string,
  publication_date: Date,
  implem_decade: string,
  main_purposes: string,
  land_use_types: Array<string>,
  land_use_has_changed: Array<string>,
  has_changed: boolean,

  land_use_prior: Array<string>,
  degradation_assessed: Array<string>,
  prevention_restoration: string,
  agroclimatic_zone: string,

  language: Array<string>,
}

export default class WocatConnector {
  landUseMap: Record<string, string> = {
    'Cropland': 'Cropland',
    'Mixed (crops/ grazing/ trees), incl. agroforestry': 'Cropland',
    'Forest/ woodlands': 'Forestland',
    'Grazing land': 'Grassland',
    'Waterways, waterbodies, wetlands': 'Wetland',
    'Other': 'Other',
    'Settlements, infrastructure': 'Other',
    'Unproductive land': 'Other',
    'Mines, extractive industries': 'Other',
    'No information': ''
  }

  countryMap: Record<string, string> = {
    'Bolivia, Plurinational State of': 'Bolivia',
    "Lao People's Democratic Republic": 'Laos',
    'Moldova, Republic of': 'Moldova',
    'Palestine, State of': 'Israel/Palestinian Territories',
    'Russian Federation': 'Russia',
    'Syrian Arab Republic': 'Syria',
    'Tanzania, United Republic of': 'Tanzania',
    'Viet Nam': 'Vietnam'
  }

  private async listQuestionnaires(page: number = 1): Promise<Record<string, any>> {
    strapi.log.info(`Practices import - listing questionnaires on page ${page}`);
    const questionnairesRequestConfig: AxiosRequestConfig = {
      method: 'GET',
      baseURL: strapi.config.get('server.wocat.baseUrl'),
      url: `/questionnaires`,
      params: { type: 'technologies', page },
      headers: {
        'Authorization': `Token ${strapi.config.get('server.wocat.token')}`,
        'Accept': 'application/json'
      }
    };
    const questionnairesResponse: AxiosResponse<Record<string, any>> = await axios(questionnairesRequestConfig);

    return questionnairesResponse.data;
  }

  private getQuestionnaireDetails(questionnaires: Record<string, Questionnaire>) {
    return async (questionnaireCode: string): Promise<Record<string, any>> => {
      strapi.log.info(`Practices import - getting questionnaire details for id ${questionnaireCode}`);
      const questionnairesRequestConfig: AxiosRequestConfig = {
        method: 'GET',
        baseURL: strapi.config.get('server.wocat.baseUrl'),
        url: `/questionnaires/${questionnaireCode}`,
        headers: {
          'Authorization': `Token ${strapi.config.get('server.wocat.token')}`,
          'Accept': 'application/json'
        }
      };
      const questionnaireDetailResponse: AxiosResponse<Record<string, any>> = await axios(questionnairesRequestConfig);

      questionnaires[questionnaireCode] = { ...questionnaireDetailResponse.data, ...questionnaires[questionnaireCode] };

      return questionnaireDetailResponse.data;
    }
  };

  private async worker(gen: Generator<Array<number>>, callFunction: (arg: any) => Promise<Record<string, any>>, result: Array<Record<string, any>>): Promise<void> {
    for (let [currentValue, index] of gen) {
      strapi.log.debug(`Worker --- index ${index} item ${currentValue}`)
      result[index] = await callFunction(currentValue)
    }
  }

  private* arrayGenerator(elementList: Array<any>): Generator<Array<number>> {
    for (let index: number = 0; index < elementList.length; index++) {
      const currentValue = elementList[index]
      yield [currentValue, index]
    }
  }

  private async loadAll(elementList: Array<any>, callFunction: (arg: any) => Promise<Record<string, any>>, workerCount: number): Promise<Array<any>> {
    const result: Array<any> = []

    if (elementList.length === 0) {
      return result
    }

    const gen: Generator<Array<number>> = this.arrayGenerator(elementList)

    workerCount = Math.min(workerCount, elementList.length)

    const workers: any[] = new Array(workerCount)
    for (let i = 0; i < workerCount; i++) {
      workers.push(this.worker(gen, callFunction, result))
    }

    await Promise.all(workers)

    return result
  }

  private getDegradationAssessed(questionnaire: Questionnaire): string[] {
    const degradationAssessed: string[] = [];

    degradationAssessed.push(
      get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__7.children.tech_qg_28.children.degradation_erosion_water_sub.value[0].values')
    );

    degradationAssessed.push(
      get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__7.children.tech_qg_29.children.degradation_erosion_wind_sub.value[0].values')
    );

    degradationAssessed.push(
      get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__7.children.tech_qg_30.children.degradation_chemical_sub.value[0].values')
    );

    degradationAssessed.push(
      get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__7.children.tech_qg_31.children.degradation_physical_sub.value[0].values')
    );

    degradationAssessed.push(
      get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__7.children.tech_qg_32.children.degradation_biological_sub.value[0].values')
    );

    degradationAssessed.push(
      get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__7.children.tech_qg_33.children.degradation_water_sub.value[0].values')
    );

    degradationAssessed.push(
      get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__7.children.tech_qg_231.children.tech_degradation_other.value[0].values')
    );

    return reject(degradationAssessed, isEmpty);
  }

  private mapWithDictionary(map: Record<string, any>, key: string): string {
    if (key in map) {
      return map[key];
    } else {
      return key;
    }
  }

  private getCountry(questionnaire: Questionnaire): string {
    return this.mapWithDictionary(
      this.countryMap,
      get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__5.children.qg_location.children.country.value[0].value', null)
    );
  }


  private getLandUseType(questionnaire: Questionnaire): string[] {
    const landUseKeys: string[] = Object.keys(get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__2.children.tech_qg_9.children'));

    if (landUseKeys.length > 0) {
      const lands: string[] = get(questionnaire, `section_specifications.children.tech__3.children.tech__3__2.children.tech_qg_9.children.${landUseKeys[0]}.value[0].values`, ['No information']);
      return lands.map(l => this.mapWithDictionary(this.landUseMap, l[0]));
    } else {
      return [];
    }
  }

  private getLandUsePrior(questionnaire: Questionnaire): string[] {
    const lands: string[] = get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__3__initial_landuse.children.tech_qg_239.children.tech_landuse_2018.value[0].values', []);
    return lands.map(l => this.mapWithDictionary(this.landUseMap, l[0]));
  }

  private getImplementationDate(questionnaire: Questionnaire): string {
    const implementationDate = get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__6.children.tech_qg_160.children.tech_implementation_year.value[0].value', null);

    if (Array.isArray(implementationDate)) {
      return implementationDate.join(';');
    }

    if (implementationDate === null) {
      return '';
    }

    return implementationDate.toString();
  }

  private getImplementationDecade(questionnaire: Questionnaire): string {
    const implementationDecade = get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__6.children.tech_qg_160.children.tech_implementation_decades.value[0].values[0]', null);

    if (Array.isArray(implementationDecade)) {
      return implementationDecade.join(';');
    }

    if (implementationDecade === null) {
      return '';
    }

    return implementationDecade.toString();
  }

  private getMainPurposes(questionnaire: Questionnaire): string {
    const mainPurposes = get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__1.children.tech_qg_6.children.tech_main_purpose.value[0].values', null);

    if (Array.isArray(mainPurposes)) {
      return mainPurposes.join(';');
    }

    if (mainPurposes === null) {
      return '';
    }

    return mainPurposes.toString();
  }

  async import(): Promise<Array<WocatPractice>> {
    const questionnaires: Record<string, Questionnaire> = {};

    const questionnairesResponse: Record<string, any> = await this.listQuestionnaires();

    // const questionnairesCount: number = 2;
    const questionnairesCount: number = Math.ceil(questionnairesResponse.count / questionnairesResponse.results.length);

    questionnairesResponse.results.forEach((result: Questionnaire) => {
      questionnaires[result.code] = result;
    });

    const listQuestionnairesResponses = await this.loadAll(range(2, questionnairesCount), this.listQuestionnaires, 15);
    listQuestionnairesResponses.forEach((questionnairesResponse) => {
      questionnairesResponse.results.forEach((result: Questionnaire) => {
        questionnaires[result.code] = result;
      });
    });

    await this.loadAll(Object.keys(questionnaires), this.getQuestionnaireDetails(questionnaires), 15);

    return Object.values(questionnaires).map((questionnaire: Questionnaire) => ({
      source_name: "WOCAT",
      source_id: questionnaire.code,

      title: get(questionnaire, 'section_general_information.children.tech__1.children.tech__1__1.children.qg_name.children.name.value[0].value', null),
      practice_url: `https://qcat.wocat.net/en/wocat/technologies/view/${questionnaire.code}`,

      short_description: get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__1.children.tech_qg_1.children.tech_definition.value[0].value', null),
      detailed_description: get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__2.children.tech_qg_2.children.tech_description.value[0].value', null),
      project_fund: get(questionnaire, 'section_general_information.children.tech__1.children.tech__1__2.children.qg_funding_project.children.funding_project.value[0].text', null),
      institution_funding: get(questionnaire, 'section_general_information.children.tech__1.children.tech__1__2.children.qg_funding_institution.children.funding_institution.value[0].text', null),
      country: this.getCountry(questionnaire),
      state_province: get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__5.children.qg_location.children.state_province.value[0].value', null),
      further_location: get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__5.children.qg_location.children.further_location.value[0].value', null),
      map_location: get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__5.children.qg_location_map.children.location_map.value[0].value', null),
      implem_date: this.getImplementationDate(questionnaire),
      implem_decade: this.getImplementationDecade(questionnaire),
      publication_date: new Date(get(questionnaire, 'created', null)),
      main_purposes: this.getMainPurposes(questionnaire),
      land_use_types: this.getLandUseType(questionnaire),
      land_use_has_changed: get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__3__initial_landuse.children.tech_qg_237.children.tech_initial_landuse_changed.value[0].values', []),
      has_changed: get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__3__initial_landuse.children.tech_qg_237.children.tech_initial_landuse_changed.value[0].values', ['No information'])[0] === 'Yes (Please fill out the questions below with regard to the land use before implementation of the Technology)',

      land_use_prior: this.getLandUsePrior(questionnaire),
      degradation_assessed: this.getDegradationAssessed(questionnaire),
      prevention_restoration: get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__8.children.tech_qg_35.children.tech_prevention.value[0].values', null),
      agroclimatic_zone: get(questionnaire, 'section_specifications.children.tech__5.children.tech__5__1.children.tech_qg_55.children.tech_agroclimatic_zone.value[0].values', null),

      language: questionnaire.translations[0],
    }))
  }

  async convertToPractice(wocatPractice: WocatPractice): Promise<Record<string, any>> {
    let practice;
    let country

    const practices = await strapi.entityService.findMany(
      'api::practice.practice',
      {
        filters: { source_name: wocatPractice.source_name, source_id: wocatPractice.source_id },
      }
    );

    if (practices.length > 1) {
      strapi.log.warn(`Multiple practices found for source_name ${wocatPractice.source_name} and source_id ${wocatPractice.source_id}`);

      await Promise.all(practices.map(async (practice) => {
        strapi.log.warn(`Deleting practice ${practice.id} with source_name ${wocatPractice.source_name} and source_id ${wocatPractice.source_id}`);
        await strapi.entityService.delete('api::practice.practice', practice.id);
      }))

      practices.length = 0;
    }

    if (wocatPractice.country) {
      country = (await strapi.entityService.findMany(
        'api::country.country',
        {
          filters: { name: wocatPractice.country },
        }
      ))[0];
    } else {
      country = null;
    }

    if (practices.length === 0) {
      strapi.log.info(`Wocat convertToPractice - creating practice from Wocat questionnaire id ${wocatPractice.source_id}`);
      practice = await strapi.entityService.create('api::practice.practice', {
        data: {
          source_name: wocatPractice.source_name,
          source_id: wocatPractice.source_id,
          title: wocatPractice.title,
          practice_url: wocatPractice.practice_url,
          short_description: wocatPractice.short_description,
          detailed_description: wocatPractice.detailed_description,
          project_fund: wocatPractice.project_fund,
          institution_funding: wocatPractice.institution_funding,
          state_province: wocatPractice.state_province,
          further_location: wocatPractice.further_location,
          map_location: wocatPractice.map_location,
          implem_date: wocatPractice.implem_date,
          publication_date: wocatPractice.publication_date,
          implem_decade: wocatPractice.implem_decade,
          main_purposes: wocatPractice.main_purposes,
          land_use_types: wocatPractice.land_use_types.join(';'),
          land_use_has_changed: wocatPractice.land_use_has_changed.join(';'),
          has_changed: wocatPractice.has_changed,
          land_use_prior: wocatPractice.land_use_prior.join(';'),
          degradation_assessed: wocatPractice.degradation_assessed.join(';'),
          prevention_restoration: wocatPractice.prevention_restoration,
          agroclimatic_zone: wocatPractice.agroclimatic_zone,
          language: wocatPractice.language.join(';'),

          country,
        },
        populate: ['country'],
      });
    } else {
      strapi.log.info(`Wocat convertToPractice - updating practice ${practices[0].id} from Wocat questionnaire id ${wocatPractice.source_id}`);

      practice = await strapi.entityService.update('api::practice.practice', practices[0].id, {
        data: {
          source_name: wocatPractice.source_name,
          source_id: wocatPractice.source_id,
          title: wocatPractice.title,
          practice_url: wocatPractice.practice_url,
          short_description: wocatPractice.short_description,
          detailed_description: wocatPractice.detailed_description,
          project_fund: wocatPractice.project_fund,
          institution_funding: wocatPractice.institution_funding,
          state_province: wocatPractice.state_province,
          further_location: wocatPractice.further_location,
          map_location: wocatPractice.map_location,
          implem_date: wocatPractice.implem_date,
          publication_date: wocatPractice.publication_date,
          implem_decade: wocatPractice.implem_decade,
          main_purposes: wocatPractice.main_purposes,
          land_use_types: wocatPractice.land_use_types.join(';'),
          land_use_has_changed: wocatPractice.land_use_has_changed.join(';'),
          has_changed: wocatPractice.has_changed,
          land_use_prior: wocatPractice.land_use_prior.join(';'),
          degradation_assessed: wocatPractice.degradation_assessed.join(';'),
          prevention_restoration: wocatPractice.prevention_restoration,
          agroclimatic_zone: wocatPractice.agroclimatic_zone,
          language: wocatPractice.language.join(';'),

          country,
        },
        populate: ['country'],
      });
    }

    return practice;
  }
}

