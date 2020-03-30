const express = require("express");
const app = express();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
const PORT = process.env.PORT || 8080;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

// START A ROLL - Triggered from the "ROLL" button
app.post("/startroll", (req, res) => {
  let isRolling = db.get("rolling").value();
  let reqData = req.body;
  // Don't start a new roll if one is currently in progress (where rolling=true in db.json)
  if (!isRolling) {
    reqData.diceCount;
    // create array of dice values.  If they sent a dice count of 3 dice, throw 3 dice on the board!
    let diceArray = [];
    for (let i = 0; i < reqData.diceCount; i++) {
      // the magic!  Add a random dice number
      diceArray.push(getRandomNumber(1, 6));
    }
    // Set user name, rolling status and dice values we created.
    db.set("rolling", true).write();
    db.set("user", reqData.user).write();
    db.set("diceArray", diceArray).write();
    res.json({ status: "success", diceArray: diceArray });
  } else {
    res.json({ status: "dice roll already in progress." });
  }
});

// STOP ROLL is recieved from the UI after the dice finish their animation
app.get("/stoproll", (req, res) => {
  // update the db to set current roll to false.
  db.set("rolling", false).write();
  res.json({ status: "success" });
});

// CHECKROLL is how the UI checks to see if a roll is already in progress
// we may be able to depricate this.
app.get("/checkroll", (req, res) => {
  let rolling = db.get("rolling").value();
  let user = db.get("user").value();
  let diceArray = db.get("diceArray").value();

  res.json({
    status: "success",
    rolling: rolling,
    user: user,
    diceArray: diceArray
  });
});

// generate random number
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  // return random 1-6
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Start the server!
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
