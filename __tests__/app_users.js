const fs = require('fs');

const dbase = require('dbase');
const users = require('../app_users.js');

const DBNAME = 'users';
const DBACCT = 'tmpAcct';

const dbname = () => Math.random().toString().substring(2, 9);
process.env.DEBUG = true;

beforeEach((done) => {
  process.env.DATABASE = `.data/${dbname()}.db`;
  fs.readFile('schema.sql', 'utf8',
    (_, data) => dbase.setup(data).then(done));
});

afterEach((done) => {
  fs.unlink(process.env.DATABASE, done);
});

test('test', (done) => {
  const email = 'text@example.com';

  // generate account
  users.genAcct(({query: { email }}))
    .then(() => dbase.select(DBACCT, 'email=?', [email]))
    // create account
    .then((res) => users.chkAcct(({ query: {
      email, code: res[0].code
    } })))
    // TODO: login success
    // TODO: when try to genAcct again will be login
    .then(done);
});
