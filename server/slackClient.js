"use strict";
const { RTMClient } = require("@slack/client");
let rtm = null;
function init(token, loglevel) {
  // The client is initialized and then started to get an active connection to the platform
  rtm = new RTMClient(token, { loglevel });
  rtm.on("authenticated", handleOnAuthenticated);
  rtm.on("message", handleOnMessage);
  return rtm;
}

function handleOnAuthenticated(connectData) {
  console.log(
    `Logged In as ${connectData.self.name} of team ${
      connectData.team.name
    }, but not yet connected to a client`
  );
}

function handleOnMessage(event) {
  console.log(`new message: ${event.text}`);
  rtm.sendMessage("this is a test message", `${event.channel}`);
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on("authenticated", handler);
}

module.exports = { init, addAuthenticatedHandler };
