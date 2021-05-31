const express = require("express");
const router = express.Router();
const {
  getAplaylist,
  getfavplaylist,
  deleteAplaylist,
  updateFavPlaylist,
  addfavplaylist,
} = require("../../controllers/favourites/favourites_playlist");

router.post("/favplaylists", addfavplaylist);
router.get("/favplaylists", getfavplaylist);
router.get("/favplaylists/:user_publickey", getAplaylist);
router.delete("/favplaylists/:user_publickey", deleteAplaylist);
router.patch("/favplaylists/:user_publickey", updateFavPlaylist);

module.exports = router;
