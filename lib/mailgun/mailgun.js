/** mailgun.js **/
const dbase = require('dbase');
const request = require('request');

const API_URL = `https://api.mailgun.net/v3/${process.env.MG_HOST}`;
const API_KEY = process.env.MG_KEY;

const DBNAME = 'emails';

module.exports = {
  // get mail template from dbase
  getText(id){
    return dbase.select(DBNAME, 'id=?', [id])
      .then((res) => {
        if (res.length) { return res[0].text; }
        else { return ''; }
      });
  },

  // ({from, to, subject, html})
  sendMail(msg) {
    if (process.env.DEBUG) {
      return Promise.resolve();
    }

    if (!API_KEY) {
      return Promise.reject(new Error('mailgun#sendMail API key not found'));
    }

    if (!msg.from || !msg.to || !msg.subject || !msg.html) {
      return Promise.reject(new Error('mailgun#sendMail message invalid format'));
    }

    return new Promise((resolve) => {
      request.post({
        form: msg,
        method: 'POST',
        baseUrl: API_URL,
        uri: '/messages',
        auth: {
          user: 'api',
          pass: API_KEY,
        },
      }, resolve);
    });
  },
};
