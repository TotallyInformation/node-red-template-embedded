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
//			 Updated by Sebastian Barwe, April 2017 for 0.0.5

var path = require("path"); // Node core library. path library for cross-platform file system specs

// Parameters not used in embedded mode: uiHost, uiPort, httpAdminAuth, httpNodeAuth, httpStatic, httpStaticAuth, https
module.exports = {
  // --- Admin Config --- //

  // Access the admin web i/f from http://<nrSrv>/admin
  httpAdminRoot: "/admin",

  // see http://nodered.org/docs/security.html for custom schemes
  // Generate pw: npm run adminauth -- your-password-here
  adminAuth: {
    //sessionExpiryTime: 86400,	// Default 7d, 86400=1d
    type: "credentials",
    users: [
      // {
      //   username: "admin",
      //   password: "", // call npm run adminauth -- mypassword to generate a password
      //   for further information see http://nodered.org/docs/security.html#generating-the-password-hash
      //   permissions: "*" // * = full access, 'read' = read-only
      // }
    ],
    default: {
      permissions: "*" // remove the * to grant no permissions to not authorized users
    }
  },

  // The maximum size of HTTP request that will be accepted by the runtime api.
  // Default: 5mb
  //apiMaxLength: '5mb',

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
  httpNodeRoot: "/",

  // Change user folder to site within this project (default: $HOME/.node-red)
  userDir: path.join(".", ".nodered"),

  // Node-RED scans the `nodes` directory in the install directory to find nodes.
  // Adds extra locn, defaults are userDir/nodes & node-red/nodes
  nodesDir: path.join(".", "nodes"),

  // The file containing the flows. If not set, it defaults to flows_<hostname>.json
  flowFile: "flows.json",

  // To enabled pretty-printing of the flow in the flow file
  // Makes git merges slightly easier
  flowFilePretty: true,

  // By default, credentials are encrypted in storage using a generated key. To
  // specify your own secret, set the following property.
  // If you want to disable encryption of credentials, set this property to false.
  // Note: once you set this property, do not change it - doing so will prevent
  // node-red from being able to decrypt your existing credentials and they will be
  // lost.
  // credentialSecret: "",

  // The maximum length, in characters, of any message sent to the debug sidebar tab
  debugMaxLength: 1000,

  // Colourise the console output of the debug node
  debugUseColors: true,

  // For better debugging
  verbose: true,

  // Configure the logging output
  logging: {
    // Only console logging is currently supported
    console: {
      // Level of logging to be recorded. Options are:
      // fatal - only those errors which make the application unusable should be recorded
      // error - record errors which are deemed fatal for a particular request + fatal errors
      // warn - record problems which are non fatal + errors + fatal errors
      // info - record information about the general running of the application + warn + error + fatal errors
      // debug - record information which is more verbose than info + info + warn + error + fatal errors
      // trace - record very detailed logging + debug + info + warn + error + fatal errors
      level: "info",
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

  // Blacklist nodes if required
  nodesExcludes: ["35-arduino.js", "36-rpi-gpio.js"],

  // enables and pre-populates the context.global variable
  functionGlobalContext: {
    // -- Pass config variables into NR for reference -- //
    //'nrPort'        : nrPort,
    // -- Pass in Libraries for convenience in function nodes -- //
    // path: path, // path library for cross-platform file system specs
    // os: require("os"),
    // fs: require("fs")
  },

  editorTheme: {
    page: {
      title: "Node-RED"
      // favicon: "/absolute/path/to/theme/icon",
      // css: "/absolute/path/to/custom/css/file",
      // scripts: "/absolute/path/to/custom/js/file"  // As of 0.17
    },
    header: {
      title: "Node-RED"
      // image: "/absolute/path/to/header/image", // or null to remove image
      // url: "http://nodered.org" // optional url to make the header text/image a link to this url
    }

    // deployButton: {
    //     type:"simple",
    //     label:"Save",
    //     icon: "/absolute/path/to/deploy/button/image" // or null to remove image
    // },

    // menu: { // Hide unwanted menu items by id. see editor/js/main.js:loadEditor for complete list
    //     "menu-item-import-library": false,
    //     "menu-item-export-library": false,
    //     "menu-item-keyboard-shortcuts": false,
    //     "menu-item-help": {
    //         label: "Alternative Help Link Text",
    //         url: "http://example.com"
    //     }
    // },

    // userMenu: false, // Hide the user-menu even if adminAuth is enabled

    // login: {
    //     image: "/absolute/path/to/login/page/big/image" // a 256x256 image
    // },

    // logout: {
    //     redirect: "http://example.com" // As of 0.17
    // }
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
};
