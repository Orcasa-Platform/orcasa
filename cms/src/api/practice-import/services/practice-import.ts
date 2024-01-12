/**
 * practice-import service
 */

import { factories } from '@strapi/strapi';
import WocatConnector from "./wocat-connector";

export default factories.createCoreService('api::practice-import.practice-import', ({ strapi }) => ({
  async import(): Promise<Record<string, any>> {
    const wocatImporter = new WocatConnector();

    const practiceImport = await strapi.entityService.create('api::practice-import.practice-import', {
      data: {
        start: new Date(),
        finished: null,
        status: 'started',
      },
    });

    try {
      wocatImporter.import()
        .then(async (practices) => {
          return Promise.all(practices.map(wocatImporter.convertToPractice))
        })
        .then(async (practices) => {
          strapi.entityService.update('api::practice-import.practice-import', practiceImport.id, {
            data: {
              finished: new Date(),
              status: 'finished',
              output: 'Imported ' + practices.length + ' practices.',
            },
          });

          strapi.log.info(`Import ${practiceImport.id} finished: Imported ${practices.length} practices.`);
        })
        .catch(async (error) => {
          throw error;
        });
    } catch (error) {
      strapi.entityService.update('api::practice-import.practice-import', practiceImport.id, {
        data: {
          finished: new Date(),
          status: 'error',
          output: error.toString(),
        },
      });

      strapi.log.error(`Import ${practiceImport.id} failed: ${error.toString()}}`);
    }

    return practiceImport;
  },
}));
