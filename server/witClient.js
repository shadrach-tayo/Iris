"use strict";
const request = require("superagent");

function handleWitResponse(res) {
  return res.entities;
}

module.exports = function witClient(token) {
  function ask(message, cb) {
    request
      .get("https://api.wit.ai/message")
      .set("Authorization", `Bearer ${token}`)
      .query({ v: "20190126" })
      .query({ q: message })
      .end((err, res) => {
        if (err) return cb(err);
        if (res.status != 200)
          return cb(`expected status to be 200 but got ${res.status}`);
        const withResponse = handleWitResponse(res.body);
        return cb(null, withResponse);
      });
  }

  return { ask };
};
