/**
 * practice-import service
 */

import { factories } from '@strapi/strapi';
import WocatConnector, { DecoratedWocatPractice, WocatPractice } from "./wocat-connector";
import PracticeDecorator from "./practice-decorator";

export type ConvertToPracticeResult = {
  practice: Record<string, any>,
  status: 'created' | 'updated' | 'skipped',
}

export default factories.createCoreService('api::practice-import.practice-import', ({ strapi }) => ({
  async decorate(): Promise<Record<string, any>> {
    const practiceDecorator: PracticeDecorator<WocatPractice, DecoratedWocatPractice> = new PracticeDecorator();
    return await practiceDecorator.decorate();
  },

  async import(): Promise<Record<string, any>> {
    const wocatImporter: WocatConnector = new WocatConnector();
    const practiceDecorator: PracticeDecorator<WocatPractice, DecoratedWocatPractice> = new PracticeDecorator();

    const practiceImport = await strapi.entityService.create('api::practice-import.practice-import', {
      data: {
        start: new Date(),
        finished: null,
        status: 'started',
      },
    });

    try {
      await wocatImporter.import()
        .then(async (practices: Array<WocatPractice>) => {
          return practiceDecorator.decoratePractices(practices);
        })
        .then(async (practices: Array<DecoratedWocatPractice>) => {
          return wocatImporter.convertToPractices(practices);
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

      strapi.log.error(`Import ${practiceImport.id} failed: ${error.toString()}`);
    }

    return practiceImport;
  },
}));
