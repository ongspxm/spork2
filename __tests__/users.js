const fs = require('fs');
const dbase = require('dbase');

const users = require('../users.js');

const DBNAME = 'users';
const DBACCT = 'tmpAcct';

const dbname = () => Math.random().toString().substring(2, 9);
process.env.DEBUG = true;

function newUser(email) {
  return users.genAcct(email)
    .then(() => dbase.select(DBACCT, 'email=?', [email]))
    .then((res) => res[0])
    .then((usr) => users.createUser({
      email, code: usr.code
    }));
}

beforeEach((done) => {
  process.env.DATABASE = `.data/${dbname()}.db`;
  fs.readFile('schema.sql', 'utf8',
    (_, data) => dbase.setup(data).then(done));
});

afterEach((done) => {
  fs.unlink(process.env.DATABASE, done);
});

test('genAcct works', (done) => {
  const email = 'text@example.com';

  // test duplicated attempt as well
  users.genAcct(email)
    .then(code => dbase.select(DBACCT)
      .then((res) => {
        expect(res.length).toBe(1);
        expect(res[0].code.substring(0, 3)).toBe(code);
      }))
    .then(() => users.genAcct(email))
    .then(code => dbase.select(DBACCT)
      .then((res) => {
        expect(res.length).toBe(1);
        expect(res[0].code.substring(0, 3)).toBe(code);
      }))
    .then(done);
});

test('genAcct non-email', done => users.genAcct('asdfasdf')
  .catch(() => done()));

test('createAcct works', (done) => {
  const email = 'test@example.com';

  newUser(email)
    .then(() => dbase.select(DBNAME))
    .then(res => expect(res.length).toBe(1))
    .then(() => dbase.select(DBACCT))
    .then(res => expect(res.length).toBe(0))
    .then(done);
});

test('createAcct wrong code', (done) => {
  const email = 'test@example.com';

  users.genAcct(email)
    .then(() => users.createUser({ email, code: '123456' }))
    .catch(() => done());
});

test('createAcct no holding acct', (done) => {
  const email = 'test@example.com';

  users.createUser({ email, code: '123456' })
    .catch(() => done());
});

test('createAcct no code given', (done) => {
  const email = 'test@example.com';

  users.createUser({ email })
    .catch(() => done());
});

test('createAcct repeated acct', (done) => {
  const email = 'repeated@example.com';

  newUser(email)
    .then(() => users.createUser({ email }))
    .catch(() => done());
});

test('createAcct wrong email', done => users.createUser({
  email: 'wrongDomain@c',
  name: 'Wrong email',
})
  .catch(() => done()));

test('changeName', (done) => {
  const email = 'ChangeUserName@example.com';
  const firstName = 'Name1';
  const secondName = 'Name2';

  users.genAcct(email)
    .then(() => dbase.select(DBACCT))
    .then((res) => res[0])
    .then((usr) => users.createUser({
      email, code: usr.code, name: firstName
    }))
    .then(() => dbase.select('users'))
    .then(res => expect(res[0].name).toBe(firstName))
    .then(() => users.changeName({
      email,
      name: secondName,
    }))
    .then(() => dbase.select('users'))
    .then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].name).toBe(secondName);
    })
    .then(done);
});

test('changeName on non-existing acct', done => users.changeName({
  email: 'nobody@example.com',
  name: 'asdf',
})
  .catch(() => done()));
