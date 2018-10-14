const fs = require('fs');
const dbase = require('dbase');

const users = require('../users.js');
const rooms = require('../rooms.js');

const DBNAME = 'rms';
const DBIMGS = 'rmsimg';

const dbname = () => Math.random().toString().substring(2, 9);

beforeEach((done) => {
  process.env.DATABASE = `.data/${dbname()}.db`;
  fs.readFile('schema.sql', 'utf8',
    (_, data) => dbase.setup(data).then(done));
});

afterEach((done) => {
  fs.unlink(process.env.DATABASE, done);
});

test('Create new room works', (done) => {
  const email = 'test@example.com';

  return users.createUser({ email })
    .then(() => rooms.newRoom({ email }))
    .then(() => dbase.select(DBNAME))
    .then(res => expect(res.length).toBe(1))
    .then(done);
});

test('Create new room without email', done => rooms.newRoom({})
  .catch(() => done()));

test('Create new room with invalid user', (done) => {
  const email = 'test@example.com';

  return rooms.newRoom({ email })
    .catch(() => done());
});

test('Update room works', (done) => {
  const email = 'test@example.com';
  const title1 = 'title 1';
  const title2 = 'title 2';

  return users.createUser({ email })
    .then(() => rooms.newRoom({ email, title: title1 }))
    .then(res => rooms.updateRoom({
      email, title: title2, rid: 1,
    }))
    .then(() => dbase.select(DBNAME))
    .then(res => expect(res[0].title).toBe(title2))
    .then(done);
});

test('Update room cannot find room', (done) => {
  const email = 'test@example.com';

  return users.createUser({ email })
    .then(() => rooms.updateRoom({
      email, rid: 100,
    }))
    .catch(() => done());
});
