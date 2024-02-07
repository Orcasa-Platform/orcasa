export { permissions };

const permissions = {
  acceptProjectChanges: [{ action: 'plugin::orcasa.project.accept-changes', subject: null }],
  declineProjectChanges: [{ action: 'plugin::orcasa.project.decline-changes', subject: null }],
  acceptOrganizationChanges: [{ action: 'plugin::orcasa.organization.accept-changes', subject: null }],
  declineOrganizationChanges: [{ action: 'plugin::orcasa.organization.decline-changes', subject: null }],
  importPractices: [{ action: 'plugin::orcasa.practices.import', subject: null }],
};
