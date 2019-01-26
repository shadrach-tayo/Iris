"use strict";
const service = require("../server/service");
const http = require("http");
const slackClient = require("../server/slackClient");
require("dotenv").config();

const token = process.env.SLACK_TOKEN || "";

const port = 8000;
const server = http.createServer(service);
const rtm = slackClient.init(token, "debug");
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(port));
server.on("listening", () => {
  console.log(`listening on http://localhost:${port}`);
});
