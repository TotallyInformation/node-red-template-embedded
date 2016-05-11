/*eslint-env node */
/*eslint indent:0,semi:0 */
/*jshint devel: true, node: true*/
/*global: */

/***
 * Start an instance of Node-Red under Express.JS
 *
 * Allows multiple instances of Node-Red to be run, even different versions in parallel.
 ***/

'use strict';  /* always for Node.JS, never global in the browser */

var http 	= require('http'),
    //https 	= require('https'),
    express = require('express'),  // THE std library for serving HTTP
    RED     = require('node-red'),
    nrSettings = require('./settings.js') // Node-Red settings file
;

// The TCP port for this systems web interface - picked up from env, package.json or fixed value
var nrPort = process.env.LOCALPORT || process.env.npm_package_config_localPort || '1880';

// Create an Express app
var app = express();

// Add a simple route for static content served from './public'
app.use( '/', express.static('public') );

// Add static route for bower components from './bower_components'
app.use( '/bower_components', express.static('bower_components') );

// Create the http server
// TODO: Add code for https server
var httpServer = http.createServer(app);

// Initialise the runtime with a server and settings
// @see http://nodered.org/docs/configuration.html
RED.init( httpServer, nrSettings );

// Serve the editor UI from /admin
app.use( nrSettings.httpAdminRoot, RED.httpAdmin );

// Serve the http nodes from /
app.use( nrSettings.httpNodeRoot, RED.httpNode );

httpServer.listen( nrPort, function(){
  console.log('Express 4 server listening on port %s, serving node-red', nrPort);
});

// Start the runtime
RED.start();
