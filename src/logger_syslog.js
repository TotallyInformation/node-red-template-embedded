/* eslint no-console: 0 */
"use strict";

const syslog = require("syslog-client"); //  BSD Syslog Protocol RFC 3164 and the Syslog Protocol RFC 5424.

module.exports = function(settings) {
  this.settings = Object.assign({}, settings, {
    syslogserver: "udp://localhost:514/nodered", // syslog server [tcp|udp]://host[:port]/program
    rfc3164: true, //set to false to use RFC 5424 syslog header format; default is true for the older RFC 3164 format.
    facility: "Local0", //  Kernel, User, System, Audit, Alert, Local0 - Local7
    tcpTimeout: 10000 // Number of milliseconds to wait for a connection attempt to the specified Syslog target, and the number of milliseconds to wait for TCP acknowledgements when sending messages using the TCP transport, defaults to 10000 (i.e. 10 seconds)
  });
  // decode connection string
  var r = /^(udp|tcp)(:\/\/)(\w+)(:([\d]+))?(\/(\w+)?)?/gi.exec(
    settings.syslogserver
  );
  if (r == null)
    throw new Error(
      "Please define a valid syslog server in your logger settings in the form of [tcp|udp]://host:port/target"
    );

  this.options = {
    syslogHostname: settings.hostname || require("os").hostname(),
    program: r[7] || "NR",
    transport: r[1] == "udp" ? syslog.Transport.Udp : syslog.Transport.Tcp,
    port: parseInt(r[5] || "514"),
    host: r[3],
    rfc3164: this.settings.rfc3164,
    facility: syslog.Facility[settings.facility]
  };

  var self = this;

  const fromLogLevel = {
    10: syslog.Severity.Alert, // "fatal",
    20: syslog.Severity.Error, // "error",
    30: syslog.Severity.Warning, // "warn",
    40: syslog.Severity.Informational, // "info",
    50: syslog.Severity.Debug, // "debug",
    60: syslog.Severity.Debug // "trace",
  };

  var client;

  function setupLogger() {
    client = syslog.createClient(self.options.host, self.options);
    client.on("close", function() {
      console.warn("socket for syslog logging closed");
      client.removeAllListeners("close");
      setTimeout(setupLogger, 1000);
    });
    client.on("error", function(error) {
      console.error("syslog logging error: ", error);
      client.removeAllListeners("error");
      client.close();
    });
  }
  console.info("Logging to syslogserver: ", settings.syslogserver);
  setupLogger();

  return function(msg) {
    if (msg.level > 60) return;

    client.log(
      self.options.program + " " + msg.msg,
      {
        timestamp: new Date(msg.timestamp),
        severity: fromLogLevel[msg.level]
      },
      function(error) {
        if (error) {
          console.error("Error sending to syslog server: ", error);
          client.close();
        }
      }
    );
  };
};
