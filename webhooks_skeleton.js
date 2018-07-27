import { Database } from 'sqlite3';

const db = new Database('./webhooks.db');

db.each('SELECT * FROM transactions;', {}, (err, row) => {
  console.log(row);
});

db.close();
