const users = require('./users.js');

function genAcct(req) {
  const { email } = req.query;

  // auto login if acct exists
  return users.getUser(email)
    .then(usr => (usr ? login() : users.genAcct(email)));
}

function login() {
  return Promise.resolve('asdf');
}

module.exports = {
  genAcct,
};
