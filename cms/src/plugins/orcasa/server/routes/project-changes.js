module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/project-changes/:id/accept',
      handler: 'projectChangeController.acceptChange',
      config: {},
    },
    {
      method: 'POST',
      path: '/project-changes/:id/decline',
      handler: 'projectChangeController.declineChange',
      config: {},
    }
  ]
}
