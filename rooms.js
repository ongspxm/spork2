const dbase = require('dbase');
const users = require('./users.js');

const DB = 'rms';
const DB_IMG = 'rmimgs';
const err = str => Promise.reject(new Error('roomError - ' + str));

function newRoom(rm){
  // ({email, title, text, vacancy}) => {rm obj}
  const { email, title, text, vacancy } = rm;
  if (!email) { return err('missing email'); }

  return users.getUser(email)
    .then(res => {
      if (!res){ return err('cannot find user'); }
    })
    .then(() => dbase.insert(DB, {
      u_email: email,
      title, text, vacancy
    }))
    .then(res => console.log(res));
}

function updateRoom(rm){
  // ({email, rid, title, text, vacancy, cover}) => {rm obj}
  const {email, rid, title, text, vacancy, cover} = rm;
  if (!email) { return err('missing email'); }
  if (!rid) { return err('missing room id'); }

  return dbase.select(DB, 'r_id=? and u_email=?', [rid, email])
    .then(res => {
      if (!res.length) { return err('cannot find room'); }
    })
    .then(() => {
      if (cover) {
        return dbase.select(DB_IMG, 'r_id=? and imgur=?', [rid, cover])
          .then(res => {
            if (!res.length){ return err('missing cover img'); }
          });
      }
    })
    .then(() => dbase.update(DB, {
      title, text, vacancy, cover
    }, 'r_id=?', [rid]))
}

function getRooms(from=0){
}

function newImg(obj){
  // ({r_id, picData}) => {imgur, link, r_id, dhash}
}

function delImg(obj){
  // ({r_id, imgurId}) => True
}

module.exports = {
  newRoom,
  updateRoom
};
