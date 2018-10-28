const express = require('express');

const app = express();

const users = require('./app_users.js');

function wrap(func) {
  return (req, res) => func(req)
    .then(data => res.send({
      ok: true,
      body: data,
    }))
    .catch((err) => {
      console.log(err);
      res.status(404);
      res.send({
        ok: false,
        body: err.msg,
      });
    });
}

function verify(func) {
  return (req, res) => wrap(func)(req, res);
}

app.get('/genAcct', wrap(users.genAcct));

const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => console.log(`started on ${port}`));
