/* dbase.js */
const sqlite = require('sqlite3').verbose();

function getDB() {
  return (new sqlite.Database(process.env.DATABASE));
}

function procData(data) {
  const keys = [];
  const vals = [];
  const rand = [];

  Object.keys(data)
    .filter(key => data[key])
    .forEach((key) => {
      keys.push(key);
      vals.push(data[key]);
      rand.push('?');
    });

  return {
    keys,
    vals,
    str: rand,
  };
}

function dbCallback(db, resolve, reject, prepend='') {
  return (err, data) => {
    db.close();

    if (err) {
      reject(prepend+' '+err);
    } else {
      resolve(data);
    }
  };
}

module.exports = {
  // callback(sqlite_obj)
  insert(table, data) {
    return new Promise((resolve, reject) => {
      const obj = procData(data);

      const sql = `INSERT INTO ${table}(${
        obj.keys.join(',')}) VALUES (${
        obj.str.join(',')})`;

      const db = getDB();
      db.serialize(() => {
        db.run(sql, obj.vals, dbCallback(db, resolve, reject));
      });
    });
  },

  // fields = [field1, field2]
  // where = "u_id=?"; params = [u_id]
  // callback(rows)
  select(table, where=false, params=[], fields=['*']) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT ${fields.join(',')} FROM ${table}`;
      if (where) {
        sql += ` WHERE ${where}`;
      }

      const db = getDB();
      db.serialize(() => {
        db.all(sql, params, dbCallback(db, resolve, reject));
      });
    });
  },

  // callback(sqlite_obj)
  update(table, data, where, params) {
    return new Promise((resolve, reject) => {
      const obj = procData(data);
      const keys = obj.keys.map(key => `${key} = ?`).join(',');

      const sql = `UPDATE ${table} SET ${keys} WHERE ${where}`;

      const db = getDB();
      db.serialize(() => {
        db.run(sql, obj.vals.concat(params),
          dbCallback(db, resolve, reject, 'db#update')
        );
      });
    });
  },

  // callback(sqlite_obj)
  delete(table, where, params) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM ${table} WHERE ${where}`;

      const db = getDB();
      db.serialize(() => {
        db.run(sql, params, dbCallback(db, resolve, reject));
      });
    });
  },

  setup(schema) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.serialize(() => {
        db.exec(schema, dbCallback(db, resolve, reject));
      });
    });
  },
};
