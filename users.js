const dbase = require('dbase');
const crypto = require('crypto');
const mailgun = require('mailgun');

const isEmail = require('email-validator').validate;

const DB_USERS = 'users';
const DB_ACCTS = 'tmpAcct';

const EMAIL = `hello@${process.env.MG_HOST}`;
const err = str => Promise.reject(Error(`user err: ${str}`));

let TXT_SUBJECT = '';
let TXT_CONTENT = '';

if (process.env.DATABASE) {
  // avoid this part when running jest
  mailgun.getText('newacct_subject').then((txt) => { TXT_SUBJECT = txt; });
  mailgun.getText('newacct_content').then((txt) => { TXT_CONTENT = txt; });
}

function genCode(len) {
  return crypto.createHash('sha256')
    .update(Math.random().toString())
    .digest('hex').substring(0, len);
}

function getUser(email) {
  return dbase.select(DB_USERS, 'email=?', [email])
    .then(res => res[0]);
}

function createUser(usr) {
  // ({email, code, name}) => usr
  if (!isEmail(usr.email)) {
    return err('Malformed Email');
  }

  if (!usr.code) {
    return err('Missing code to create acct');
  }

  return dbase.select(DB_ACCTS, 'email=? and code=?', [usr.email, usr.code])
    .then((res) => res.length == 1
      ? Promise.resolve()
      : err('Unable to find holding acct'))
    .then(() => dbase.insert(
      DB_USERS, { email: usr.email, name: usr.name },
    ))
    .then(() => dbase.delete(DB_ACCTS, 'email=?', [usr.email]));
}

function changeName(usr) {
  // ({email, name})
  return getUser(usr.email)
    .then((res) => {
      if (!res) { return err('User Not Exist'); }
      return Promise.resolve();
    })
    .then(dbase.update(
      DB_USERS, { name: usr.name },
      'email=?', [usr.email],
    ));
}

function genAcct(email) {
  // (email) => (code_1)
  // create holding acct and code, and sends out email
  // if tmpAcct exist, refresh code
  const code = genCode(3);
  const code2 = genCode(3);
  const data = { email, code: code + code2 };

  if (!isEmail(email)) {
    return err('Malformed Email');
  }

  return getUser(email)
    .then((res) => {
      if (res) { return err('User Already Exist'); }
      return Promise.resolve();
    })
    .then(() => dbase.select(DB_ACCTS, 'email=?', [email]))
    .then(res => (res.length === 1
      ? dbase.update(DB_ACCTS, data, 'email=?', [email])
      : dbase.insert(DB_ACCTS, data)))
    .then(() => mailgun.sendMail({
      to: email,
      from: EMAIL,
      subject: TXT_SUBJECT,
      html: TXT_CONTENT.replace('{{ code }}', code + code2),
    }))
    .then(() => code);
}

module.exports = {
  getUser,
  createUser,
  changeName,
  genAcct,
};
