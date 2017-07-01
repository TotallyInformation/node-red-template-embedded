/* eslint-env node */
/* eslint indent:0,semi:0, no-console: 0 */
/* jshint devel: true, node: true*/
/* global: */

/***
 * Start an instance of Node-Red under Express.JS
 *
 * Allows multiple instances of Node-Red to be run, even different versions in parallel.
 ***/

"use strict" /* always for Node.JS, never global in the browser */;

// logging ************
// you should consider using the packages debug and console-stamp to
// incorporate standard logging with node-red logging

// The TCP port for this systems web interface - picked up from env, package.json or fixed value
const http_port =
  process.env.HTTPPORT || process.env.npm_package_config_http_port || 1880;
const use_https =
  process.env.USEHTTPS ||
  process.env.npm_package_config_use_https == "true" ||
  false;
const listening_address =
  process.env.LISTENINGADDRESS ||
  process.env.npm_package_config_listening_address ||
  "0.0.0.0";

const http = use_https ? require("https") : require("http");

const express = require("express"); // THE std library for serving HTTP
const RED = require("node-red");
var nrSettings = require("../settings.js"); // Node-Red settings file
const fs = require("fs");

// you can set a default credential secret for storing node's credentials within node red
// normally this is secret is generated randomly and stored in the user directory (config)
// if you are sharing your flows over different systems  (e.g. windows, linux etc)
// and want to keep your used credentials used within your flow, it more convenient to setup
// a fixed secret here
if (
  !(process.env.npm_package_config_nr_credentialsecret === undefined ||
    process.env.npm_package_config_nr_credentialsecret === null)
)
  nrSettings.credentialSecret =
    process.env.npm_package_config_nr_credentialsecret;

if (process.env.npm_package_config_nr_userfolder)
  nrSettings.userDir = process.env.npm_package_config_nr_userfolder;

if (process.env.npm_package_config_nr_flowfile)
  nrSettings.flowFile = process.env.npm_package_config_nr_flowfile;

if (process.env.npm_package_config_nr_title) {
  nrSettings.editorTheme.page.title = nrSettings.editorTheme.header.title =
    process.env.npm_package_config_nr_title;
}

// Create an Express app
var app = express();

// Add a simple route for static content served from './public'
app.use("/", express.static("./public"));

// Add static route for bower components from './bower_components'
app.use("/bower_components", express.static("./bower_components"));

// Create the http(s) server
if (use_https) {
  var privateKey = fs.readFileSync("./server.key", "utf8");
  var certificate = fs.readFileSync("./server.crt", "utf8");
  var credentials = {
    key: privateKey,
    cert: certificate
  };
}
var httpServer = use_https
  ? http.createServer(credentials, app)
  : http.createServer(app);

// Initialise the runtime with a server and settings
// @see http://nodered.org/docs/configuration.html
RED.init(httpServer, nrSettings);

// Serve the editor UI from /admin
app.use(nrSettings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes from /
app.use(nrSettings.httpNodeRoot, RED.httpNode);

httpServer.listen(http_port, listening_address, function() {
  console.info(
    "Express 4 https server listening on http%s://%s:%d%s, serving node-red",
    use_https ? "s" : "",
    httpServer.address().address.replace("0.0.0.0", "localhost"),
    httpServer.address().port,
    nrSettings.httpAdminRoot
  );
});

// Start the runtime
RED.start();
