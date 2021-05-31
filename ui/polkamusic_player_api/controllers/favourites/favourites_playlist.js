const connection = require("../../db");
const controller = require("../../db");

exports.getfavplaylist = (req, res) => {
  connection.query("SELECT * FROM favourites_playlist", (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
};

exports.getAplaylist = (req, res) => {
  connnection.query(
    "SELECT * FROM favourites_playlist WHERE user_publickey = ?",
    req.params.user_publickey,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send(result);
    }
  );
};

exports.deleteAplaylist = (req, res) => {
  connection.query(
    "DELETE FROM favourites_playlist WHERE user_publickey = ?",
    req.params.user_publickey,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send(result);
    }
  );
};

exports.updateFavPlaylist = (req, res) => {
  connection.query(
    "UPDATE FROM favourites_playlist SET playlist_id= ? WHERE user_publickey = ?",
    [req.body.id, req.params.user_publickey],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send(result);
    }
  );
};

exports.addfavplaylist = (req, res) => {
  connnection.query(
    "INSERT INTO favourites_playlist(user_publickey,playlist_id) VALUES(?,?)",
    [req.body.user_publickey, req.body.playlist_id],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.send(result);
    }
  );
};
