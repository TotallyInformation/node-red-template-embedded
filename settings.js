/*eslint-env node */
/*eslint indent:0,semi:0 */
/*jshint devel: true, node: true*/
/*global: */

/**
 * Copyright 2013, 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// NOTE: Amended by Julian Knight, May 2016
//			 Changed for compatibility with running Node-Red in "embedded" mode
//			 allowing multiple instances and easier team working.

var path = require('path');     // Node core library. path library for cross-platform file system specs

// Parameters not used in embedded mode: uiHost, uiPort, httpAdminAuth, httpNodeAuth, httpStatic, httpStaticAuth, https
module.exports = {
	// --- Admin Config --- //

	// Access the admin web i/f from http://<nrSrv>/admin
  httpAdminRoot:'/admin',

  /*
	// see http://nodered.org/docs/security.html for custom schemes
	adminAuth: { // Generate pw: node -e 'console.log(require('bcryptjs').hashSync(process.argv[1], 8));' your-password-here
		//sessionExpiryTime: 86400,	// Default 7d, 86400=1d
		type: 'credentials',
		users: [{
			username: 'admin',
			password: '$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.',
			permissions: '*'	// * = full access, 'read' = read-only
		}],
		default: {
			permissions: '*'
		}
	},
  */

  /*
  // Reorder the node pallette, array of category names
  paletteCategories: [
    'subflows', 'input', 'output', 'function', 'storage', 'advanced', 'formats', 'Raspberry Pi', 'social', 'analysis'
  ],
  */

	// The following property can be used to disable the editor. The admin API
	// is not affected by this option. To disable both the editor and the admin
	// API, use either the httpRoot or httpAdminRoot properties
	//disableEditor: false,

	// --- Admin Config --- //

	// --- Runtime Config --- //

	// Retry time in milliseconds for MQTT connections
  mqttReconnectTime: 15000,

  // Retry time in milliseconds for Serial port connections
  serialReconnectTime: 15000,

  // Retry time in milliseconds for TCP socket connections
  //socketReconnectTime: 10000,

	// Timeout in milliseconds for TCP server socket connections, defaults to no timeout
  //socketTimeout: 120000,

	// Some nodes, such as HTTP In, can be used to listen for incoming http requests.
	// By default, these are served relative to '/'. The following property
	// can be used to specifiy a different root path. If set to false, this is
	// disabled.
	httpNodeRoot: '/',

  // Change user folder to site within this project (default: $HOME/.node-red)
	userDir: path.join('.', '.nodered'),

	// Node-RED scans the `nodes` directory in the install directory to find nodes.
  // Adds extra locn, defaults are userDir/nodes & node-red/nodes
  nodesDir: path.join('.', 'nodes'),

  // The file containing the flows. If not set, it defaults to flows_<hostname>.json
  flowFile: 'flows.json',

	// To enabled pretty-printing of the flow in the flow file
	// Makes git merges slightly easier
  flowFilePretty: true,

  // For better debugging
  verbose: true,

	// Configure the logging output
  logging: { // Only console logging is currently supported
		console: {
			// Level of logging to be recorded. Options are:
			// fatal - only those errors which make the application unusable should be recorded
			// error - record errors which are deemed fatal for a particular request + fatal errors
			// warn - record problems which are non fatal + errors + fatal errors
			// info - record information about the general running of the application + warn + error + fatal errors
			// debug - record information which is more verbose than info + info + warn + error + fatal errors
			// trace - record very detailed logging + debug + info + warn + error + fatal errors
			level: 'info',
			// Whether or not to include metric events in the log output
			metrics: false,
			// Whether or not to include audit events in the log output
			audit: false
		}
	},

	/* Add a custom middleware function for Express in front of all http in nodes.
	// Allows custom authentication for all http in nodes, or any other sort of common request processing.
  httpNodeMiddleware: function(req,res,next) {
    // Handle/reject the request, or pass it on to the http in node by calling next();
    next();
  },
  */

	// --- End of Runtime Config --- //

	// --- Node configuration --- //

  // max length of debug output
	debugMaxLength: 1000,

  // Blacklist nodes if required
  //nodesExcludes:['35-arduino.js','36-rpi-gpio.js'],

  // enables and pre-populates the context.global variable
  functionGlobalContext: {
      // -- Pass config variables into NR for reference -- //
      //'nrPort'        : nrPort,
      // -- Pass in Libraries for convenience in function nodes -- //
      'path'          : path      // path library for cross-platform file system specs
	}

	// --- End of Node configuration --- //

  // The following property can be used to configure cross-origin resource sharing
  // in the HTTP nodes.
  // See https://github.com/troygoode/node-cors#configuration-options for
  // details on its contents. The following is a basic permissive set of options:
  //httpNodeCors: {
  //    origin: "*",
  //    methods: "GET,PUT,POST,DELETE"
  //},

  // If you need to set an http proxy please set an environment variable
  // called http_proxy (or HTTP_PROXY) outside of Node-RED in the operating system.
  // For example - http_proxy=http://myproxy.com:8080
  // (Setting it here will have no effect)
  // You may also specify no_proxy (or NO_PROXY) to supply a comma separated
  // list of domains to not proxy, eg - no_proxy=.acme.co,.acme.co.uk

}
