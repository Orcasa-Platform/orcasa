/**
 * practice router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/practices/filters',
      handler: 'practice.filters',
      config: {
        policies: []
      }
    }
  ]
}
