const dbase = require('dbase');

const DB = 'rms';
const DB_IMG = 'rmimgs';
const err = str => Promise.reject(new Error('roomError - ' + str));

function getRooms(from=0){
}

function newRoom(rm){
  // ({email, title, text, vacancy}) => {rm obj}
  const { email, title, text, vacancy } = rm;
  if (!email) { return err('missing email'); }

  return dbase.insert(DB, {
    email, title, text, vacancy
  });
}

function updateRoom(obj){
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

function newImg(obj){
  // ({r_id, picData}) => {imgur, link, r_id, dhash}
}

function delImg(obj){
  // ({r_id, imgurId}) => True
}
