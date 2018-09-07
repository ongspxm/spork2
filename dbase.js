/* dbase.js */
const sqlite = require('sqlite3');

function getDB() {
  return (new sqlite.Database(process.env.DATABASE));
}

function procData(data) {
  const keys = [];
  const vals = [];
  const rand = [];

  Object.keys(data).forEach((key) => {
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

module.exports = {
  // callback(sqlite_obj)
  insert(table, data) {
    return new Promise((resolve) => {
      const obj = procData(data);

      const sql = `INSERT INTO ${table}(${
        obj.keys.join(',')}) VALUES (${
        obj.str.join(',')})`;

      const db = getDB();
      db.run(sql, obj.vals, resolve);
      db.close();
    });
  },

  // fields = [field1, field2]
  // where = "u_id=?"; params = [u_id]
  // callback(rows)
  select(table, where, params, fields) {
    return new Promise((resolve, reject) => {
      let vals = '*';
      if (fields) {
        vals = fields.join(',');
      }

      const sql = `SELECT ${vals} FROM ${table} WHERE ${where}`;

      const db = getDB();
      db.all(sql, params, (dbErr, rows) => {
        if (dbErr) {
          console.log(`err: dbase.select - ${dbErr}`);
          return reject();
        }
        return resolve(rows);
      });
      db.close();
    });
  },

  // callback(sqlite_obj)
  update(table, data, where, params) {
    return new Promise((resolve) => {
      const obj = procData(data);
      const keys = obj.keys.map(key => `${key} = ?`).join(',');

      const sql = `UPDATE ${table} SET ${keys} WHERE ${where}`;

      const db = getDB();
      db.run(sql, obj.vals.concat(params), resolve);
      db.close();
    });
  },

  // callback(sqlite_obj)
  delete(table, where, params) {
    return new Promise((resolve) => {
      const sql = `DELETE FROM ${table} WHERE ${where}`;

      const db = getDB();
      db.run(sql, params, resolve);
      db.close();
    });
  },

  setup(schema) {
    return new Promise((resolve) => {
      const db = getDB();
      db.exec(schema, resolve);
      db.close();
    });
  },
};
