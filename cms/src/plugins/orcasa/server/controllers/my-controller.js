'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('orcasa')
      .service('myService')
      .getWelcomeMessage();
  },
});
