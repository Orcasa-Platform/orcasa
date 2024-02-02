export { permissions };

const permissions = {
  acceptProjectChanges: [{ action: 'plugin::orcasa.project.accept-changes', subject: null }],
  declineProjectChanges: [{ action: 'plugin::orcasa.project.decline-changes', subject: null }],
  importPractices: [{ action: 'plugin::orcasa.practices.import', subject: null }],
};
