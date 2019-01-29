"use strict";
const request = require("superagent");

function process(intentData, registry, cb) {
  if (intentData.intent[0].value !== "weather") {
    return cb(
      new Error(
        `Expected weather intent, but got ${intentData.intent[0].value}`
      )
    );
  }

  if (!intentData.location)
    return cb(new Error(`Missing Location in weather intent`));

  const location = intentData.location[0].value;

  const service = registry.get("weather");

  if (!service) {
    return cb(false, "No weather service Available");
  }

  request(
    `http://${service.ip}:${service.port}/service/${location}`,
    (err, res) => {
      if (err || res.statusCode != 200 || !res.body.result) {
        console.log(err);
        return cb(
          false,
          `I had a problem finding out the weather in ${location}`
        );
      }
      return cb(false, `In ${location} it is ${res.body.result}`);
    }
  );
}

module.exports = { process };
