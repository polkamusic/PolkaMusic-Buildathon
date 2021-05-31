const connection = require("../../db");

exports.favourites = (req, res) => {
  connection.query("SELECT * FROM favourites", (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
};

exports.delFavPlaylist = (req, res) => {
  connection.query(
    "DELETE FROM favourites WHERE playlist_id = ? ",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.status(200).send(result);
    }
  );
};

exports.updateFavPlaylist = (req, res) => {
  connection.query(
    "UPDATE favourites SET playlist_id = ? WHERE song_src = ? ",
    [req.parmas.id, req.body.song_src],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send(result);
    }
  );
};

exports.delFavSong = (req, res) => {
  connection.query(
    "DELETE FROM favourites WHERE song_src = ?",
    req.params.src,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send(result);
    }
  );
};

exports.updateFavSong = (req, res) => {
  connection.query(
    "UPDATE favourites SET song_src = ? WHERE playlist_id = ?",
    [req.params.src, req.body.playlist_id],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send(result);
    }
  );
};

exports.addfavourites = (req, res) => {
  connection.query(
    "INSERT INTO favourites(song_src,playlist_id) VALUES(?,?);",
    [req.body.song_src, req.body.playlist_id],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send(result);
    }
  );
};
