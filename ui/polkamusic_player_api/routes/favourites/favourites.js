const express = require("express");
const router = express.Router();
const {
  delFavPlaylist,
  delFavSong,
  favourites,
  updateFavPlaylist,
  addfavourites,
  updateFavSong,
} = require("../../controllers/favourites/favourites");

router.get("/favourites", favourites);
router.post("/favourites", addfavourites);
router.delete("/favourites/:id", delFavPlaylist);
router.patch("/favourites/:id", updateFavPlaylist);
router.delete("/favourites/:src", delFavSong);
router.patch("/favourites/:src", updateFavSong);

module.exports = router;
