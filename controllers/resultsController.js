const mySQLQuery = require("../mysql/connection.js");

const getResults = async (req, res) => {
  console.log("GET RESULTS");
  try {
    const results = await mySQLQuery("SELECT * FROM results ORDER BY gametime LIMIT 10");

    console.log("results", results);
    if (results && results.length) {
      return res.json(results);
    }

    res.json({});
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

const setResult = async (req, res) => {
  // save the game result to the database
  console.log("SET RESULT");
  try {
    const { gametime, nickname } = req.body;

    // check for missing data
    if (!gametime || !nickname) {
      res.send({ status: 500, reason: "Missing data" });
      return;
    }

    // check for valid and sensible data
    const gameTimeNumber = Number(gametime);

    if (Number.isNaN(gameTimeNumber) || gameTimeNumber < 2000 || gameTimeNumber > 1000000) {
      res.send({ status: 500, reason: "Invalid game score" });
      return;
    }

    // check for valid nickname with Regex - must be exactly
    // 3 x capital letters long.
    if (!new RegExp("^[A-Z]{3}$").test(nickname)) {
      res.send({ status: 500, reason: "Invalid nickname" });
      return;
    }

    // check for duplicate
    const dupCheck = await mySQLQuery(
      "SELECT * FROM results WHERE gametime LIKE ? AND nickname LIKE ?",
      [gameTimeNumber, nickname]
    );

    if (dupCheck && dupCheck.length) {
      res.send({ status: 500, reason: "Duplicate data" });
      return;
    }

    await mySQLQuery(
      "INSERT INTO results (id, timestamp, gametime, nickname) VALUES (NULL, current_timestamp(), ?, ?)",
      [gametime, nickname]
    );
  } catch (e) {
    res.sendStatus(500);
  }

  res.sendStatus(200);
};

module.exports = { getResults, setResult };
