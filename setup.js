const fs = require('fs');
const dbase = require('dbase');

// checking .env params
const fields = 'MG_KEY MG_HOST IMGUR_APP_ID DATABASE'.split(' ');
const missing = fields.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.log(`Missing keys: ${missing.join(', ')}`);
  process.exit();
}

// initializing the tables
fs.readFile('schema.sql', 'utf8', (err, data) => {
  dbase.setup(data).then(() => console.log('dbase initialized'));
});
