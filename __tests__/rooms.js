const fs = require('fs');
const dbase = require('dbase');

const users = require('../users.js');
const rooms = require('../rooms.js');

const DBNAME = 'rms';
const DBIMGS = 'rmimgs';

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
    .then(() => rooms.updateRoom({
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

test('Add new img works', (done) => {
  const email = 'test@example.com';
  const data = 'https://picsum.photos/200/300';

  let gImg;
  return users.createUser({ email })
    .then(() => rooms.newRoom({ email }))
    .then(() => rooms.addImg({ email, rid: 1, data }))
    .then((img) => { gImg = img; })
    .then(() => dbase.select(DBIMGS))
    .then((res) => {
      expect(res.length).toBe(1);
      expect(res[0]).toEqual(gImg);
      done();
    });
});

test('Add new img cannot find room', (done) => {
  const email = 'test@example.com';
  const data = 'https://picsum.photos/200/300';

  return users.createUser({ email })
    .then(() => rooms.addImg({ email, rid: 1, data }))
    .catch(() => done());
});

test('Add new img cannot find user', (done) => {
  const email = 'test@example.com';
  const data = 'https://picsum.photos/200/300';

  return rooms.addImg({ email, rid: 1, data })
    .catch(() => done());
});

test('Del img works', (done) => {
  const email = 'test@example.com';
  const data = 'https://picsum.photos/200/300';

  return users.createUser({ email })
    .then(() => rooms.newRoom({ email }))
    .then(() => rooms.addImg({ email, rid: 1, data }))
    .then(img => rooms.delImg({ email, rid: 1, imgid: img.id }))
    .then(() => dbase.select(DBIMGS))
    .then((res) => {
      console.log(res);
      expect(res.length).toBe(0);
    })
    .then(() => done());
});

test('Del img, cannot find image', (done) => {
  // nothing done, will just attempt empty delete
  const email = 'test@example.com';
  const data = 'https://picsum.photos/200/300';

  return users.createUser({ email })
    .then(() => rooms.newRoom({ email }))
    .then(() => rooms.delImg({ email, rid: 1, imgur: data }))
    .then(() => done());
});

test('Del img, cannot find room', (done) => {
  const email = 'test@example.com';
  const data = 'https://picsum.photos/200/300';

  return users.createUser({ email })
    .then(() => rooms.delImg({ email, rid: 1, imgur: data }))
    .catch(() => done());
});

test('Del img, cannot find user', (done) => {
  const email = 'test@example.com';
  const data = 'https://picsum.photos/200/300';

  return rooms.delImg({ email, rid: 1, imgur: data })
    .catch(() => done());
});
