import AcceptChangeButton from './components/AcceptChangeButton/acceptChangeButton';
import DeclineChangeButton from './components/DeclineChangeButton/declineChangeButton';
import ImportPracticesButton from './components/ImportPracticesButton/importPracticesButton';

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
  },
};
