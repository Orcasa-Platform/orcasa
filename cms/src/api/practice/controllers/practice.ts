/**
 * practice controller
 */

import { factories } from '@strapi/strapi'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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
export default factories.createCoreController('api::practice.practice', () => ({
  async import(ctx) {
    const baseURL = "https://qcat.wocat.net/en/api/v2/"

    let page: number = 1;
    let next: boolean = true;
    const questionnaires: Record<string, Questionnaire> = {};

    while (next) {
      strapi.log.info(`Practices import - loading questionnaires page ${page}`);
      const questionnairesRequestConfig: AxiosRequestConfig = {
        method: 'GET',
        baseURL,
        url: `/questionnaires`,
        params: { type: 'technologies', page },
        headers: {
          'Authorization': `Token ${strapi.config.get('server.wocat.token')}`,
          'Accept': 'application/json'
        }
      };
      const questionnairesResponse: AxiosResponse<Record<string, any>> = await axios(questionnairesRequestConfig);

      questionnairesResponse.data.results.forEach((result) => {
        questionnaires[result.code] = result;
      });

      // if (questionnairesResponse.data.next) {
      //   page++;
      // } else {
      next = false;
      // }
    }

    const questionnaireDetails = await Promise.all(Object.keys(questionnaires).map(async (questionnaireCode) => {
      strapi.log.info(`Practices import - loading questionnaire detail ${questionnaireCode}`);

      const questionnaireDetailRequestConfig: AxiosRequestConfig = {
        method: 'GET',
        baseURL,
        url: `/questionnaires/${questionnaireCode}`,
        headers: {
          'Authorization': `Token ${strapi.config.get('server.wocat.token')}`,
          'Accept': 'application/json'
        }
      };

      const questionnaireDetailResponse = await axios(questionnaireDetailRequestConfig);

      questionnaires[questionnaireCode] = { ...questionnaireDetailResponse.data, ...questionnaires[questionnaireCode] };
    }));

    // return questionnaires;

    return {
      practices: Object.values(questionnaires).map((questionnaire) => ({
        source_name: "WOCAT",
        source_id: questionnaire.code,
        title: questionnaire.title,
        language: questionnaire.translations[0][0],
        country: questionnaire['section_specifications']['children']['tech__2']['children']['tech__2__5']['children']['qg_location']['children']['country']['value'][0]['value'],
        short_description: questionnaire['section_specifications']['children']['tech__2']['children']['tech__2__2']['children']['tech_qg_2']['children']['tech_description']['value'][0]['value'],
      }))
    };
  },
}));
