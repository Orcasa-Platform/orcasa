import AcceptChangeButton from "./extensions/components/AcceptChangeButton/acceptChangeButton";
import DeclineChangeButton from "./extensions/components/DeclineChangeButton/declineChangeButton";

export default {
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
