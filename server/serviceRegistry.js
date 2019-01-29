"use strict";

module.exports = class ServiceRegistry {
  constructor() {
    this._services = new Map();
    this._timeout = 30;
  }

  add(intent, ip, port) {
    const key = intent + ip + port;
    if (!this._services.has(key)) {
      this._services.set(key, {
        ip,
        port,
        intent,
        timeStamp: Math.floor(new Date() / 1000)
      });
      console.log(`added service for ${intent}`);
      return;
    }
    const oldService = this._services.get(key);
    this._services.set(
      key,
      Object.assign({}, oldService, {
        timeStamp: Math.floor(new Date() / 1000)
      })
    );
    this._cleanUp();
  }

  remove(intent, ip, port) {
    const key = intent + ip + port;
    this._services.delete(key);
  }

  get(intent) {
    this._cleanUp();
    let service = null;
    this._services.forEach((value, _) => {
      if (value.intent == intent) return (service = value);
    });
    return service;
  }

  _cleanUp() {
    const now = Math.floor(new Date() / 1000);
    for (let [key, value] of this._services.entries()) {
      if (value.timeStamp + this._timeout < now) {
        console.log(`Removed ${value.intent} from registry`);
        this._services.delete(key);
      }
    }
  }
};
