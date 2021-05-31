const connection = require("../db");

exports.getPlaylists = (req, res) => {
  connection.query("SELECT * FROM playlist", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
};

exports.getAPlaylist = (req, res) => {
  connection.query(
    "SELECT * FROM playlist WHERE playlist_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send(result);
    }
  );
};

exports.deleteAPlaylist = (req, res) => {
  connection.query(
    "DELETE FROM playlist WHERE playlist_id = ?",
    req.params.id,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.send(result);
    }
  );
};
