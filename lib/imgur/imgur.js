/** imgur.js */
const request = require('request');
const dbase = require('dbase');

const API_URL = endpt => `https://api.imgur.com/3${endpt}`;
const API_KEY = process.env.IMGUR_APP_ID;

module.exports = {
  // callback(url)
  getURL(id) {
    return dbase.select('imgurs', 'id=?', [id])
      .then((imgs) => {
        if (imgs.length === 1) {
          return imgs[0].url;
        }
        throw new Error('imgur#getUrl() unable to find image');
      });
  },

  // callback({id, url, delHash})
  upload(data) {
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

        const img = {
          id: body.data.id,
          url: body.data.link,
          delHash: body.data.deletehash,
        };

        return dbase.insert('imgurs', img)
          .then(() => resolve(img));
      });
    }));
  },

  // callback()
  delete(id) {
    return dbase.select('imgurs', 'id=?', [id])
      .then((imgs) => {
        if (imgs.length < 1) {
          return Promise.resolve();
        }

        const opts = {
          url: API_URL(`/image/${imgs[0].delHash}`),
          json: true,
          headers: {
            Authorization: `Client-ID ${API_KEY}`,
          },
        };

        return (new Promise((resolve, reject) => {
          request.delete(opts, (error, result, body) => {
            if (error) { return reject(error); }
            if (!body.success) { return reject(body.data.error); }

            return dbase.delete('imgurs', 'id=?', [id]).then(resolve);
          });
        }));
      });
  },
};
