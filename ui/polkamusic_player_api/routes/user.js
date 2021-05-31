const express = require("express");
const router = express.Router();
const {
  getAllAlbums,
  getAllUsers,
  deleteSong,
  postUser,
  getAllArtists,
  getASong,
} = require("../controllers/user");

router.post("/user", postUser);
router.get("/users", getAllUsers);
router.get("/users/:song_name", getASong);
router.get("/artists", getAllArtists);
router.get("/albums", getAllAlbums);
router.delete("/users/:song_name", deleteSong);

module.exports = router;
