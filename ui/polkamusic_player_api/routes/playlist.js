const express = require("express");
const router = express.Router();
const {
  deleteAPlaylist,
  getAPlaylist,
  getPlaylists,
} = require("../controllers/playlist");

router.get("/playlists", getPlaylists);
router.get("/playlists/:id", getAPlaylist);
router.delete("/playlists/:id", deleteAPlaylist);

module.exports = router;
