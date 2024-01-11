/**
 * practice controller
 */

import { factories } from '@strapi/strapi'
import { WocatPractice } from "../services/wocat-connector";


export default factories.createCoreController('api::practice.practice', ({ strapi }) => ({
  async import(ctx) {
    const wocatPractices: Array<WocatPractice> = await strapi.service('api::practice.practice').wocatImporter();

    await Promise.all(wocatPractices.map(strapi.service('api::practice.practice').convertToPractice));

    return 'OK';
  },
}));
