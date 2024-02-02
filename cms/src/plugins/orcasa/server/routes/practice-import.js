module.exports = {
    type: 'admin',
    routes: [
      {
        method: 'POST',
        path: '/practice-import/import',
        handler: 'practiceImportController.import',
      },
      {
        method: 'POST',
        path: '/practice-import/decorate',
        handler: 'practiceImportController.decorate',
      }
    ]
}
