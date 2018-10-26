/** imgur.js */
const request = require('request');

const API_URL = endpt => `https://api.imgur.com/3${endpt}`;
const API_KEY = process.env.IMGUR_APP_ID;

module.exports = {
  // callback({id, url, delHash})
  upload(data) {
    if (process.env.DEBUG) {
      return Promise.resolve({
        id: 'imgurid',
        url: 'imgur.com/i/imgurid.jpg',
        dhash: 'imgurdelhash',
      });
    }

    const opts = {
      url: API_URL('/image'),
      headers: {
        Authorization: `Client-ID ${API_KEY}`,
      },
      json: {
        image: data,
      },
    };

    return (new Promise((resolve, reject) => {
      request.post(opts, (error, result, body) => {
        if (error) { return reject(error); }
        if (!body.success) { return reject(body.data.error); }

        return resolve({
          id: body.data.id,
          url: body.data.link,
          dhash: body.data.deletehash,
        });
      });
    }));
  },

  // callback()
  delete(delhash) {
    if (process.env.DEBUG) {
      return Promise.resolve();
    }

    const opts = {
      url: API_URL(`/image/delhash`),
      json: true,
      headers: {
        Authorization: `Client-ID ${API_KEY}`,
      },
    };

    return (new Promise((resolve, reject) => {
      request.delete(opts, (error, result, body) => {
        if (error) { return reject(error); }
        if (!body.success) { return reject(body.data.error); }
        return resolve();
      });
    }));
  },
};
