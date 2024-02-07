module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/organization-changes/:id/accept',
      handler: 'organizationChangeController.acceptChange',
      config: {},
    },
    {
      method: 'POST',
      path: '/organization-changes/:id/decline',
      handler: 'organizationChangeController.declineChange',
      config: {},
    }
  ]
}
