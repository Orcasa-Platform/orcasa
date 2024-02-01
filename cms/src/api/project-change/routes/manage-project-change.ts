export default {
  routes: [
    {
      method: 'POST',
      path: '/project-change/:id/accept-change',
      handler: 'project-change.acceptChange',
    }
  ]
}
