import AcceptChangeButton from './components/AcceptChangeButton/acceptChangeButton';
import DeclineChangeButton from './components/DeclineChangeButton/declineChangeButton';
import ImportPracticesButton from './components/ImportPracticesButton/importPracticesButton';
import AcceptOrganizationChangeButton from "./components/AcceptOrganizationChangeButton/acceptOrganizationChangeButton";
import DeclineOrganizationChangeButton
  from "./components/DeclineOrganizationChangeButton/declineOrganizationChangeButton";

export default {
  register(app) {
  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: `accept-changes`,
      Component: AcceptChangeButton,
    });
    app.injectContentManagerComponent('editView', 'right-links', {
      name: `decline-changes`,
      Component: DeclineChangeButton,
    });
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
