const fs = require('fs');
const dbase = require('dbase');

const users = require('../users.js');
const DBNAME = 'users';

const dbname = () => Math.random().toString().substring(2,9);

beforeEach(done => {
  process.env.DATABASE = `.data/${dbname()}.db`;
  fs.readFile('schema.sql', 'utf8',
    (_, data) => dbase.setup(data).then(done));
});

afterEach((done) => {
  fs.unlink(process.env.DATABASE, done);
})

test('Creating new user works', done => {
  return users.createUser({
    email: 'createNewUser@example.com',
    name: 'No problem'
  })
    .then(() => dbase.select(DBNAME))
    .then(res => expect(res.length).toBe(1))
    .then(done);
});

test('Repeated acct', done => {
  const email = 'repeated@example.com';

  return users.createUser({email})
    .then(users.createUser({email}))
    .then(
      () => Promise.reject('failed'),
      () => done()
    );
});

test('Wrong email', done => {
  return users.createUser({
    email: 'wrongDomain@c',
    name: 'Wrong email'
  }).then(
    () => Promise.reject('failed'),
    () => done()
  );
});

test('Changing user name works', done => {
  const email = 'ChangeUserName@example.com';
  const firstName = 'Name1';
  const secondName = 'Name2';

  return users.createUser({
    email,
    name: firstName
  })
    .then(() => dbase.select('users'))
    .then(res => expect(res[0].name).toBe(firstName))
    .then(() => users.changeName({
      email,
      name: secondName
    }))
    .then(() => dbase.select('users'))
    .then(res => {
      expect(res.length).toBe(1);
      expect(res[0].name).toBe(secondName);
    })
    .then(done);
});

test('Change name on non-exist', done => {
  return users.changeName({
    email:'nobody@example.com',
    name:'asdf'
  })
    .then(
      () => Promise.reject('failed'),
      () => done()
    );
});
