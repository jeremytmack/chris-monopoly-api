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

app.post("/startroll", (req, res) => {
  let isRolling = db.get("rolling").value();
  let reqData = req.body;
  if (!isRolling) {
    reqData.diceCount;
    // create array of dice values
    let diceArray = [];
    for (let i = 0; i < reqData.diceCount; i++) {
      diceArray.push(getRandomNumber(1, 6));
    }
    db.set("rolling", true).write();
    db.set("user", reqData.user).write();
    db.set("diceArray", diceArray).write();
    res.json({ status: "success", diceArray: diceArray });
  } else {
    res.json({ status: "error" });
  }
});

app.get("/stoproll", (req, res) => {
  db.set("rolling", false).write();
  res.json({ status: "success" });
});

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

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  // return random 1-6
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
