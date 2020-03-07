/* eslint no-console: 0 */
"use strict";

require("paint-console");

/**
 * @param {*} settings settings object from node-red logger settings
 */
module.exports = function(settings) {
  this.settings = Object.assign({}, settings, {
    divider: " " // col divider
    // currently not supported timestampformat: "", // format of timestamp as a moment.js format string
  });

  const self = this;

  const loglevel = {
    10: "fatal",
    20: "error",
    30: "warn",
    40: "info",
    50: "debug",
    60: "trace",
    98: "audit",
    99: "metric"
  };
  /**
   * @param {*} msg logmessage { level: numeric, msg: string, timestamp: unixtimestamp/numeric }
   */
  return function(msg) {
    let message = msg.level > 90 ? msg.event + ": " + msg.value : msg.msg;
    let msgline =
      new Date(msg.timestamp).toLocaleString(undefined, {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }) +
      self.settings.divider +
      "[" +
      (loglevel[msg.level] ? loglevel[msg.level] : msg.level) +
      "] " +
      self.settings.divider +
      message;

    switch (msg.level) {
      case 10:
      case 20:
        console.error(msgline);
        break;
      case 30:
        console.warn(msgline);
        break;
      case 40:
        console.info(msgline);
        break;
      default:
        console.log(msgline);
        break;
    }
  };
};
