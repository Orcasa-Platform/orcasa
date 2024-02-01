export { permissions };

const permissions = {
  acceptChanges: [{ action: 'plugin::import-export-entries.export', subject: null }],
  declineChanges: [{ action: 'plugin::import-export-entries.import', subject: null }],
};
