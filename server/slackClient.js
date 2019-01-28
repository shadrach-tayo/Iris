"use strict";
const { RTMClient } = require("@slack/client");
let rtm = null;
let nlp = null;
let registry = null;

function init(token, loglevel, nlpClient, serviceRegistry) {
  // The client is initialized and then started to get an active connection to the platform
  rtm = new RTMClient(token, { loglevel });
  nlp = nlpClient;
  registry = serviceRegistry;
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

function handleOnMessage(message) {
  if (message.text.toLowerCase().includes("iris")) {
    nlp.ask(message.text, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }

      try {
        if (!res.intent || !res.intent[0] || !res.intent[0].value)
          throw new Error("Could not extract intent");
        const intent = require(`./intents/${res.intent[0].value}Intent`);
        intent.process(res, registry, (err, response) => {
          if (err) {
            console.log(err);
            return;
          }

          rtm.sendMessage(response, message.channel);
        });
      } catch (error) {
        console.log(error);
        rtm.sendMessage(
          "Sorry I don't know what you are talking about",
          message.channel
        );
      }
    });
  }
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on("authenticated", handler);
}

module.exports = { init, addAuthenticatedHandler };
