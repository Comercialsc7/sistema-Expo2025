let db: any = null;

if (typeof window !== 'undefined') {
  try {
    const PouchDBBrowser = require('pouchdb-browser');
    const PouchDBFindPlugin = require('pouchdb-find');

    const PouchDB = PouchDBBrowser.default || PouchDBBrowser;
    const PouchDBFind = PouchDBFindPlugin.default || PouchDBFindPlugin;

    if (typeof PouchDB === 'function') {
      PouchDB.plugin(PouchDBFind);

      db = new PouchDB('offline_db', {
        auto_compaction: true,
        revs_limit: 1,
      });

      db.createIndex({
        index: {
          fields: ['table'],
        },
      }).catch((err: any) => {
        console.error('Error creating PouchDB index:', err);
      });
    } else {
      throw new Error('PouchDB is not a constructor');
    }
  } catch (error) {
    console.warn('PouchDB não pode ser carregado:', error);
  }
}

if (!db) {
  console.warn('PouchDB não está disponível - usando mock');
  db = {
    put: () => Promise.reject(new Error('PouchDB not available')),
    get: () => Promise.reject(new Error('PouchDB not available')),
    find: () => Promise.reject(new Error('PouchDB not available')),
    remove: () => Promise.reject(new Error('PouchDB not available')),
    allDocs: () => Promise.reject(new Error('PouchDB not available')),
    destroy: () => Promise.reject(new Error('PouchDB not available')),
    createIndex: () => Promise.reject(new Error('PouchDB not available')),
  };
}

export default db;
