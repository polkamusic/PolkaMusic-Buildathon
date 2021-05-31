const connection = require("../db");

exports.postUser = (req, res) => {
  connection.query(
    "INSERT INTO user(song_name, artist_name, song_track, song_album, song_url) VALUES (?,?,?,?,?)",
    [
      req.body.song_name,
      req.body.artist_name,
      req.body.song_track,
      req.body.song_album,
      req.body.song_url,
    ],
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result.affectedRows);
      res.send(result.affectedRows);
    }
  );
};

exports.getAllUsers = (req, res) => {
  connection.query("SELECT * FROM user", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
};

exports.getASong = (req, res) => {
  connection.query(
    "SELECT * FROM user WHERE song_name = ",
    req.params.song_name,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
};

exports.getAllArtists = (req, res) => {
  connection.query(`SELECT artist_name FROM user`, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
};

exports.getAllAlbums = (req, res) => {
  connection.query(`SELECT song_album FROM user`, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
};

exports.deleteSong = (req, res) => {
  connection.query(
    "DELETE FROM user WHERE song_name = ?",
    req.params.song_name,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
};
