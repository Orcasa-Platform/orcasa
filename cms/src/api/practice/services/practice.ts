import { factories } from '@strapi/strapi';
import WocatConnector from "./wocat-connector";


export default factories.createCoreService('api::practice.practice', ({ strapi }) => ({
  async wocatImporter(): Promise<Array<any>> {
    const wocatImporter = new WocatConnector();

    return await wocatImporter.import();
  },
  async convertToPractice(wocatPractice): Promise<Record<string, any>> {
    const wocatImporter = new WocatConnector();

    return await wocatImporter.convertToPractice(wocatPractice);
  },
}));
