const express = require("express");
const router = express.Router();

const { getResults, setResult } = require("../controllers/resultsController.js");

router.get("/", getResults);
router.post("/", setResult);

module.exports = router;
