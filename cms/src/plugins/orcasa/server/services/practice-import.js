const PracticeDecorator = require('./practice-decorator');
const WocatConnector = require('./wocat-connector');

module.exports = ({ strapi }) => ({
  async decorate() {
    const practiceDecorator = new PracticeDecorator();
    return await practiceDecorator.decorate();
  },

  async import() {
    const wocatImporter = new WocatConnector();
    const practiceDecorator = new PracticeDecorator();

    const practiceImport = await strapi.entityService.create('api::practice-import.practice-import', {
      data: {
        start: new Date(),
        finished: null,
        status: 'started',
      },
    });

    try {
      await wocatImporter.import()
        .then(async (practices) => {
          return practiceDecorator.decoratePractices(practices);
        })
        .then(async (practices) => {
          return wocatImporter.convertToPractices(practices);
        })
        .then(async (results) => {
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
});
