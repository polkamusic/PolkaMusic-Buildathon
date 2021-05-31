const express = require("express");
const router = express.Router();
const {
  deleteAReport,
  getAReport,
  getReports,
  updateDuration,
  createReports,
} = require("../controllers/reports");

router.post("/reports", createReports);
router.get("/reports", getReports);
router.get("/reports/:src", getAReport);
router.delete("/reports/:src", deleteAReport);
router.patch("/reports/duration", updateDuration);

module.exports = router;
