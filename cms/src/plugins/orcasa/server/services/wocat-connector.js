const AsyncService = require('./async-service');
const axios = require('axios');
const { get, isEmpty, range, reject } = require('lodash');

module.exports = class WocatConnector extends AsyncService {
  landUseMap = {
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

  countryMap = {
    'Bolivia, Plurinational State of': 'Bolivia',
    "Lao People's Democratic Republic": 'Laos',
    'Moldova, Republic of': 'Moldova',
    'Palestine, State of': 'Israel/Palestinian Territories',
    'Russian Federation': 'Russia',
    'Syrian Arab Republic': 'Syria',
    'Tanzania, United Republic of': 'Tanzania',
    'Viet Nam': 'Vietnam'
  }

  landUseTypesMap = {
    'Grassland': 'Grassland',
    'Cropland': 'Cropland',
    'Forestland': 'Forest Land',
    'Wetland': 'Wetlands',
    'Other': 'Other Land',
  }

  async listQuestionnaires(page = 1) {
    strapi.log.info(`Practices import - listing questionnaires on page ${page}`);
    const questionnairesRequestConfig = {
      method: 'GET',
      baseURL: strapi.config.get('server.wocat.baseUrl'),
      url: `/questionnaires`,
      params: { type: 'technologies', page },
      headers: {
        'Authorization': `Token ${strapi.config.get('server.wocat.token')}`,
        'Accept': 'application/json'
      }
    };
    const questionnairesResponse = await axios(questionnairesRequestConfig);

    return questionnairesResponse.data;
  }

  getQuestionnaireDetails(questionnaires) {
    return async (questionnaireCode) => {
      strapi.log.info(`Practices import - getting questionnaire details for id ${questionnaireCode}`);
      const questionnairesRequestConfig = {
        method: 'GET',
        baseURL: strapi.config.get('server.wocat.baseUrl'),
        url: `/questionnaires/${questionnaireCode}`,
        headers: {
          'Authorization': `Token ${strapi.config.get('server.wocat.token')}`,
          'Accept': 'application/json'
        }
      };
      const questionnaireDetailResponse = await axios(questionnairesRequestConfig);

      questionnaires[questionnaireCode] = { ...questionnaireDetailResponse.data, ...questionnaires[questionnaireCode] };

      return questionnaireDetailResponse.data;
    }
  };

  getDegradationAssessed(questionnaire) {
    const degradationAssessed = [];

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

  mapWithDictionary(map, key) {
    if (key in map) {
      return map[key];
    } else {
      return key;
    }
  }

  getCountry(questionnaire) {
    return this.mapWithDictionary(
      this.countryMap,
      get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__5.children.qg_location.children.country.value[0].value', null)
    );
  }

  getLandUseType(questionnaire) {
    const landUseKeys = Object.keys(get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__2.children.tech_qg_9.children'));

    if (landUseKeys.length > 0) {
      const lands = get(questionnaire, `section_specifications.children.tech__3.children.tech__3__2.children.tech_qg_9.children.${landUseKeys[0]}.value[0].values`, []);
      return lands.map(l => this.mapWithDictionary(this.landUseTypesMap, l[0]));
    } else {
      return [];
    }
  }

  getLandUsePrior(questionnaire) {
    const lands = get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__3__initial_landuse.children.tech_qg_239.children.tech_landuse_2018.value[0].values', []);
    return lands.map(l => this.mapWithDictionary(this.landUseMap, l[0]));
  }

  getImplementationDate(questionnaire) {
    const implementationDate = get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__6.children.tech_qg_160.children.tech_implementation_year.value[0].value', null);

    if (Array.isArray(implementationDate)) {
      return implementationDate.join(';');
    }

    if (implementationDate === null) {
      return '';
    }

    return implementationDate.toString();
  }

  getImplementationDecade(questionnaire) {
    const implementationDecade = get(questionnaire, 'section_specifications.children.tech__2.children.tech__2__6.children.tech_qg_160.children.tech_implementation_decades.value[0].values[0]', null);

    if (Array.isArray(implementationDecade)) {
      return implementationDecade.join(';');
    }

    if (implementationDecade === null) {
      return '';
    }

    return implementationDecade.toString();
  }

  getMainPurposes(questionnaire) {
    const mainPurposes = get(questionnaire, 'section_specifications.children.tech__3.children.tech__3__1.children.tech_qg_6.children.tech_main_purpose.value[0].values', null);

    if (Array.isArray(mainPurposes)) {
      return mainPurposes.join(';');
    }

    if (mainPurposes === null) {
      return '';
    }

    return mainPurposes.toString();
  }

  async import() {
    const questionnaires = {};

    const questionnairesResponse = await this.listQuestionnaires();

    // const questionnairesCount = 4;
    const questionnairesCount = Math.ceil(questionnairesResponse.count / questionnairesResponse.results.length);

    questionnairesResponse.results.forEach((result) => {
      questionnaires[result.code] = result;
    });

    const listQuestionnairesResponses = await this.loadAll(range(2, questionnairesCount), this.listQuestionnaires, 15);
    listQuestionnairesResponses.forEach((questionnairesResponse) => {
      questionnairesResponse.results.forEach((result) => {
        questionnaires[result.code] = result;
      });
    });

    await this.loadAll(Object.keys(questionnaires), this.getQuestionnaireDetails(questionnaires), 15);

    return Object.values(questionnaires).map((questionnaire) => ({
      source_name: "WOCAT",
      source_id: questionnaire.code,

      title: get(questionnaire, 'section_general_information.children.tech__1.children.tech__1__1.children.qg_name.children.name.value[0].value', 'Untitled'),
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

      language: questionnaire.translations[0].filter(language => language.length === 2),
    }))
  }

  async convertToPractice(wocatPractice) {
    let practice = null
    let country = null;
    let land_use_types = [];
    let land_use_priors = [];
    let practice_intervention = null;
    let subinterventions = null;

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
    }

    if (wocatPractice.land_use_priors) {
      if (wocatPractice.land_use_priors.length > 0 && typeof wocatPractice.land_use_priors[0] === 'string') {
        land_use_priors = (await strapi.entityService.findMany(
          'api::land-use-type.land-use-type',
          {
            filters: { name: { $in: wocatPractice.land_use_priors } },
          }
        ));
      } else {
        land_use_priors = wocatPractice.land_use_priors
      }

    }

    if (wocatPractice.land_use_types) {
      if (wocatPractice.land_use_types.length > 0 && typeof wocatPractice.land_use_types[0] === 'string') {
        land_use_types = (await strapi.entityService.findMany(
          'api::land-use-type.land-use-type',
          {
            filters: { name: { $in: wocatPractice.land_use_types } },
          }
        ));
      } else {
        land_use_types = wocatPractice.land_use_types
      }
    }

    if (wocatPractice.intervention) {
      if (typeof wocatPractice.intervention === 'string') {
        practice_intervention = (await strapi.entityService.findMany(
          'api::practice-intervention.practice-intervention',
          {
            filters: { name: wocatPractice.intervention },
          }
        ));
      } else {
        practice_intervention = wocatPractice.intervention
      }
    }

    if (wocatPractice.practice_intervention) {
      practice_intervention = wocatPractice.practice_intervention
    }

    if (wocatPractice.subinterventions) {
      subinterventions = wocatPractice.subinterventions
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
          land_use_has_changed: wocatPractice.land_use_has_changed.join(';'),
          has_changed: wocatPractice.has_changed,
          degradation_assessed: wocatPractice.degradation_assessed.join(';'),
          language: wocatPractice.language.join(';'),
          sync: ('sync' in wocatPractice) ? wocatPractice.sync : true,
          show: true,

          land_use_types,
          land_use_priors,
          practice_intervention,
          country,
          subinterventions,
        },
        populate: ['country', 'land_use_types', 'land_use_prior', 'practice_intervention']
      });
    } else {
      if (practices[0].sync === false) {
        strapi.log.info(`Wocat convertToPractice - practice ${practices[0].id} from Wocat flagged for no sync, skipping...`);
        return {
          practice: practices[0],
          status: 'skipped',
        };
      }
      strapi.log.info(`Wocat convertToPractice - updating practice ${practices[0].id} from Wocat questionnaire id ${wocatPractice.source_id}`);

      try {
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
            land_use_has_changed: wocatPractice.land_use_has_changed.join(';'),
            has_changed: wocatPractice.has_changed,
            degradation_assessed: wocatPractice.degradation_assessed.join(';'),
            language: wocatPractice.language.join(';'),
            sync: ('sync' in wocatPractice) ? wocatPractice.sync : false,
            show: practices[0].show === null ? true : practices[0].show,

            land_use_types,
            land_use_priors,
            practice_intervention,
            country,
            subinterventions,
          },
          populate: ['country', 'land_use_types', 'land_use_prior', 'practice_intervention']
        });
      } catch (error) {
        throw error;
      }

    }

    return {
      practice,
      status: practices.length === 0 ? 'created' : 'updated',
    };
  }

  async convertToPractices(wocatPractices) {
    return this.loadAll(wocatPractices, this.convertToPractice, 15);
  }
}

