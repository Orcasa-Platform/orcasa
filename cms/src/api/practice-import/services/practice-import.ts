/**
 * practice-import service
 */

import { factories } from '@strapi/strapi';
import WocatConnector from "./wocat-connector";

export type ConvertToPracticeResult = {
  practice: Record<string, any>,
  status: 'created' | 'updated' | 'skipped',
}

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
          return wocatImporter.convertToPractices(practices);
          // return Promise.all(practices.map(wocatImporter.convertToPractice))
        })
        .then(async (results: Array<ConvertToPracticeResult>) => {
          strapi.entityService.update('api::practice-import.practice-import', practiceImport.id, {
            data: {
              finished: new Date(),
              status: 'finished',
              output: JSON.stringify({
                practices: results.length,
                created: results.filter((result) => result.status === 'created').length,
                updated: results.filter((result) => result.status === 'updated').length,
                skipped: results.filter((result) => result.status === 'skipped').length,
              }),
            },
          });

          strapi.log.info(`Import ${practiceImport.id} finished: Imported ${results.length} practices.`);
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
