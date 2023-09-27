module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/project-change/:id/accept-change',
      handler: 'projectChangeController.acceptChange',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/project-change/:id/decline-change',
      handler: 'projectChangeController.declineChange',
      config: {
        policies: [],
      },
    }
  ]
}
