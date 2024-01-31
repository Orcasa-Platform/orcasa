
export default {
  routes: [
    {
      method: 'GET',
      path: '/practice-import/import',
      handler: 'practice-import.import'
    },
    {
      method: 'GET',
      path: '/practice-import/decorate',
      handler: 'practice-import.decorate'
    }
  ]
}
