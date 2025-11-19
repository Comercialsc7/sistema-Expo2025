import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

const db = new PouchDB('offline_db', {
  auto_compaction: true,
  revs_limit: 1,
});

db.createIndex({
  index: {
    fields: ['table'],
  },
}).catch((err) => {
  console.error('Error creating index:', err);
});

export default db;
