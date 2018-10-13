const dbase = require('dbase');
const crypto = require('crypto');

const isEmail = require('email-validator').validate;

const DB_NAME = 'users';

function genCode(len) {
  return crypto.createHash('sha256')
    .update(Math.random().toString())
    .digest('hex').substring(0, len);
}

function getUser(email) {
  return dbase.select(DB_NAME, 'email=?', [email])
    .then(res => res[0]);
}

function createUser(usr) {
  // ({email, name}) => usr
  if (!isEmail(usr.email)) {
    return Promise.reject('Malformed Email');
  }

  return getUser(usr.email)
    .then((res) => {
      if (res) { throw 'User Exist'; }
    })
    .then(() => dbase.insert(
      DB_NAME, { email: usr.email, name: usr.name }
    ));
}

function changeName(usr) {
  // ({email, name})
  return getUser(usr.email)
    .then((res) => {
      if (!res) { throw 'User Not Exist'; }
    })
    .then(dbase.update(
      DB_NAME, { name: usr.name },
      'email=?', [usr.email]
    ));
}

module.exports = {
  createUser,
  changeName
};
