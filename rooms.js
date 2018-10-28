const dbase = require('dbase');
const imgur = require('imgur');
const users = require('./users.js');

const DB = 'rms';
const DB_IMG = 'rmimgs';
const err = str => Promise.reject(new Error(`roomError - ${str}`));

function getRoom(email, rid) {
  return dbase.select(DB, 'r_id=? and u_email=?', [rid, email])
    .then((res) => {
      if (!res.length) { return err('cannot find room'); }
      return Promise.resolve(res[0]);
    });
}

function newRoom(rm) {
  // ({email, title, text, vacancy})
  const {
    email, title, text, vacancy,
  } = rm;
  if (!email) { return err('missing email'); }

  return users.getUser(email)
    .then((res) => {
      if (!res) { return err('cannot find user'); }
      return Promise.resolve();
    })
    .then(() => dbase.insert(DB, {
      u_email: email,
      title,
      text,
      vacancy,
    }));
}

function updateRoom(rm) {
  // ({email, rid, title, text, vacancy, cover})
  const {
    email, rid, title, text, vacancy, cover,
  } = rm;
  if (!email) { return err('missing email'); }
  if (!rid) { return err('missing room id'); }

  return getRoom(email, rid)
    .then(() => {
      if (cover) {
        return dbase.select(DB_IMG, 'r_id=? and imgur=?', [rid, cover])
          .then((res) => {
            if (!res.length) { return err('missing cover img'); }
            return Promise.resolve();
          });
      }
      return Promise.resolve();
    })
    .then(() => dbase.update(DB, {
      title, text, vacancy, cover,
    }, 'r_id=?', [rid]));
}

function getRooms(obj) {
  // ({from})
}

function addImg(obj) {
  // ({email, rid, data}) => {imgur, link, r_id, dhash}
  const { email, rid, data } = obj;

  let gImg;
  return getRoom(email, rid)
    .then(() => imgur.upload(data))
    .then((res) => {
      gImg = {
        r_id: rid,
        id: res.id,
        url: res.url,
        dhash: res.dhash,
      };
    })
    .then(() => dbase.insert(DB_IMG, gImg))
    .then(() => gImg);
}

function delImg(obj) {
  // ({email, rid, imgid})
  const { email, rid, imgid } = obj;

  return getRoom(email, rid)
    .then(() => dbase.delete(DB_IMG, 'id=? and r_id=?', [imgid, rid]));
}

module.exports = {
  newRoom,
  updateRoom,
  addImg,
  delImg,
};
