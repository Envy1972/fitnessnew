const fs = require('fs') ;
const sqlite3 = require('sqlite3').verbose();

exports.handler = async function() {
  const db = new sqlite3.Database('./fitness.db');
  const sql = fs.readFileSync('./migrations/0001_initial.sql', 'utf8');
  
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        reject({ statusCode: 500, body: JSON.stringify({ error: err }) });
      } else {
        resolve({ statusCode: 200, body: JSON.stringify({ message: 'Database initialized' }) });
      }
      db.close();
    });
  });
};
