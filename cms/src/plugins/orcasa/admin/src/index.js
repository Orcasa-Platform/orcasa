import pluginPkg from '../../package.json';
import AcceptChangeButton from './components/AcceptChangeButton/acceptChangeButton';
import DeclineChangeButton from './components/DeclineChangeButton/declineChangeButton';

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
  },
};
