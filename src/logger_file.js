"use strict";
const fs = require("fs");
const path = require("path");

module.exports = function(settings) {
  this.settings = Object.assign({}, settings, {
    logfilename: path.join(process.cwd(), "nr.log"),
    divider: "\t", // col divider
    newline: "\n" // newline characters typically \r\n (CRLF) or \n (LF)
    // currently not supported timestampformat: "", // format of timestamp as a moment.js format string
    // currently not supported maxfilesize: "128", // archive if logfile comes to this filesize in megabyte
    // currently not supported maxagedays: "31", // archive if first message of the logfile is these days old
    // currently not supported archives: 1 // 0 to disable archive, log file will be just truncated
  });

  var self = this;
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

  return function(msg) {
    //       msg:  {
    //            level: 99,
    //   event: 'runtime.memory.heapTotal',
    //   value: 50941952,
    //   timestamp: 1494598611942 }
    //     msg:  { level: 40,
    //   msg: 'Node-RED version: v0.16.2',
    //   timestamp: 1494887695896 }
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
      message +
      self.settings.newline;

    fs.appendFileSync(self.settings.logfilename, msgline);
  };
};
