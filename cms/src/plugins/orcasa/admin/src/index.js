import ImportPracticesButton from './components/ImportPracticesButton/importPracticesButton';

export default {
  register(app) {
  },

  bootstrap(app) {
    app.injectContentManagerComponent('listView', 'actions', {
      name: `import-practices`,
      Component: ImportPracticesButton,
    });
  },
};
