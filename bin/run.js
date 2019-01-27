"use strict";
const service = require("../server/service");
const http = require("http");
const slackClient = require("../server/slackClient");
require("dotenv").config();

const token = process.env.SLACK_TOKEN || "";
const witToken = process.env.WIT_TOKEN || "";
const slackLogLevel = process.env.SLACK_LOG_LEVEL || "";

// initialize witClient
const withClient = require("../server/witClient")(witToken);

const port = 8000;
const server = http.createServer(service);
const rtm = slackClient.init(token, slackLogLevel, withClient);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(port));
server.on("listening", () => {
  console.log(`listening on http://localhost:${port}`);
});
