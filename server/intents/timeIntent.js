"use strict";
const request = require("superagent");

function process(intentData, cb) {
  if (intentData.intent[0].value !== "time") {
    return cb(
      new Error(`Expected time intent, but got ${intentData.intent[0].value}`)
    );
  }

  if (!intentData.location)
    return cb(new Error(`Missing Location in time intent`));

  const location = intentData.location[0].value;
  request(`http://localhost:8010/service/${location}`, (err, res) => {
    if (err || res.statusCode != 200 || !res.body.result) {
      console.log(err);
      console.log(res);
      return cb(false, `I had a problem finding out the time in ${location}`);
    }
    return cb(false, `In ${location}, it is now ${res.body.result}`);
  });
}

module.exports = { process };
