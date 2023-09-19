/**
 * project-change service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::project-change.project-change', ({ strapi }) => ({
  async acceptChanges(...args) {
    let response = { okay: true }

    if (response.okay === false) {
      return { response, error: true }
    }

    return response
  },
}));
