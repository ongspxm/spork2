const users = require('./users.js');

const getReq = (req, key) => (req.body && req.body[key])
  ? req.body[key] : req.query[key];

function genAcct(req) {
  const email = getReq(req, 'email');

  // auto login if acct exists
  return users.getUser(email)
    .then(usr => (usr ? login() : users.genAcct(email)));
}

function chkAcct(req) {
  const email = getReq(req, 'email');
  const code = getReq(req, 'code');
  const name = getReq(req, 'name');

  return users.createUser({ email, code, name });
}

function login() {
  return Promise.resolve('asdf');
}

module.exports = {
  genAcct,
  chkAcct,
};
