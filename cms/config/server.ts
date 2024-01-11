export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('CMS_URL', null),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  wocat: {
    baseUrl: env('WOCAT_BASEURL', 'https://qcat.wocat.net/en/api/v2/'),
    token: env('WOCAT_TOKEN', null),
  }
});
