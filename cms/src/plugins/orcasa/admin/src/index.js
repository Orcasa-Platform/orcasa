import ImportPracticesButton from './components/ImportPracticesButton/importPracticesButton';
import AcceptOrganizationChangeButton from "./components/AcceptOrganizationChangeButton/acceptOrganizationChangeButton";
import DeclineOrganizationChangeButton
  from "./components/DeclineOrganizationChangeButton/declineOrganizationChangeButton";

export default {
  register(app) {
  },

  bootstrap(app) {
    app.injectContentManagerComponent('listView', 'actions', {
      name: `import-practices`,
      Component: ImportPracticesButton,
    });
    app.injectContentManagerComponent('editView', 'right-links', {
      name: `accept-organization-changes`,
      Component: AcceptOrganizationChangeButton,
    });
    app.injectContentManagerComponent('editView', 'right-links', {
      name: `decline-organization-changes`,
      Component: DeclineOrganizationChangeButton,
    });
  },
};
