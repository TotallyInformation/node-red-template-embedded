**NOTE**: This repo is no longer maintained since things have moved on with Node-RED and there is better information now available. I will leave this up as a reference but I am closing it off, no futher updates will happen and no further issues can be raised.

----

# node-red-template-embedded
A template project for running Node-Red in "embedded" mode which is great if you want to run multiple instances of Node-Red or work collaboratively with others. Also lets you take control of the ExpressJS server.

# Release Notes
## v0.0.5 
* Updated README
* Removed references to node-red-contrib-ui
* updated settings.js file for further style customizing
* added npm config section with most instance setup parameters, see [Configuration section](#configuration)
* added npm script to create self signed certificate for https, see [Enabling HTTPS section](#enabling-https)
* added npm script to create passwords for the node-red interface (user login), see [Enabling User authentication section](#enabling-user-authentication)
* added server listening on localhost by default, can be configured, see  [Granting access from other network interfaces](#allow-access-from-other-networks-than-localhost)
* using cross-env to set NodeJS environment variables 
* used prettier on code

## v0.0.4 
* Update readme - Added reference to SelfSigned-Cert-Creator for HTTPS

## v0.0.3 
* Update readme - Added alternative approaches and a warning about version constraints

## v0.0.2 
* Update readme - Added comment to configuration section of readme to inform that node-red-contrib-ui is installed. Initial testing also completed. Works on Windows 10 64bit with node.js v4.4.3 and Node-red v0.13.4. UI and http-in/out also tested.

## v0.0.1 
* INITIAL RELEASE - I've not yet fully tested this. Please use with caution. Let me know of any issues.

# Basic Installation
```bash
# Create a project folder and change into it
mkdir myproject && cd myproject
# Clone this repository into the project folder
git clone https://github.com/TotallyInformation/node-red-template-embedded.git .
# Install the pre-requisite modules (Express, Node-Red)
npm install
# Install some additional nodes if required ...
#npm install node-red-contrib-xx node-red-contrib-yy --save
# Start the server (runs 'node server.js')
npm start
```
If you are not using git, you can instead [download the zip file](https://github.com/TotallyInformation/node-red-template-embedded/archive/master.zip) from GitHub and unpack to a convenient location.

# Configuration

The most relevant configuration settings can be setup within the _config_ section of `package.json`. If not set, the default values are used or may be overridden by environment variables.
The node-red specific settings are contained in `settings.js`.

This template project is pre-configured with the following default configuration:

- the default http or https port is 1881
- http is activated by default, not https
- User folder set to `./.nodered`
- Flows file of `./.nodered/flows.json` (with the file set to "pretty" to make git diffs easier to work with)
- Static web folder set to `./public` (take care not to end up with a name clash between files/folders in public and http-in nodes)
- Default URI of `/`
- Default admin URI of `/admin`
- Verbose output on, logging level `info`
- I've *not* put any version constraints on either Node-Red or UI in `package.json`, you might want to add some to prevent future upgrade issues on a live installation
- Some other odds and ends either set to defaults or commented out for later use.

The default configuration should work on all platforms including Windows.

## package.json

These are the default settings in package.json.


```js
 "config" : {
   // the http(s) port used by node-red (for editor, http endpoints etc.)
   "http_port" : "1880", 
   // to start the https server you need to provide server certificates by server.key and server.crt
   // files. You can generate them by calling
   // > npm run selfsigned -- my-domain.com
   // or via openssl 
   // > openssl genrsa -out server.key 2048
   // > openssl req -new -x509 -key server.key -out server.crt -days 365
   "use_https" : "false",
   // the server is listening to localhost by default, so that only 
   // your local machine can access node-red.
   // Set this to the name or IP address of you network interface you want to
   // bind the server to or use "0.0.0.0" to listen on all available interfaces
   "listening_address" : "localhost",
   // the default node-red user folder, this is where your backups, credentials, node library etc. is being stored
   "nr_userfolder" : "./.nodered",
   // the flow file to load and save our flows to. 
   // NOTE: you can override this setting here via npm to launch other flow configurations
   // see  
   "nr_flowfile" : "./flows.json",
   // you can set a default credential secret for storing node's credentials within node red
   // normally this is secret is generated randomly and stored in the user directory (config)
   // if you are sharing your flows over different systems  (e.g. windows, linux etc) 
   // and want to keep your used credentials used within your flow, it more convenient to setup
   // a fixed secret here
   "nr_credentialsecret" : null,
   // Title and header for this custom Node-RED instance, you can define more in settings.js
   "nr_title" : "Node RED Embedded"
  },

```
The settings in `package.json` can be overridden on commandline, e.g. 

```ps
npm run debug --node-red-template-embedded:http_port=1882 
```

see [npm-config](https://docs.npmjs.com/misc/config) for more information on dealing with npm settings.

## settings.js

The Node-Red specific configuration is all in `settings.js`, simply change this to meet your own requirements.

## server.js

Make changes to server.js if you need to add/change the ExpressJS server such as adding security using Passport.

# Enabling HTTPS

Enabling https is easy following these steps:

1. Change configuration in `package.json` in the config section and set a `use_https` to `true`.
2. run `npm run selfsigned -- my-domain.com` which will create new self signed certificates. 
3. Start the server by `npm start` or `npm run debug`

Note: You can provide own signed certificates by the files `server.key` and `server.crt`. 
You can use OpenSSL as well. Although this code has not been updated, I do have a shell script and some instructions
for generating valid self-signed certificates in another repo: 
 [SelfSigned-Cert-Creator](https://github.com/TotallyInformation/SelfSigned-Cert-Creator)

# Enabling User authentication

By default every has access to the editor and there can not only see but also change the flow configuration.
This is ok for really private setups and test scenarios.
You should enable user authentication to the admin interface at `adminAuth` in `settings.js`.
You can generate passwords for your users with `npm run adminauth -- your-password-here`.
For further information see http://nodered.org/docs/security.html#generating-the-password-hash

*Note: Do not forget to restrict the default permissions !*

# Allow access from other networks than localhost

Change the `listening_address` in the config section of `package.json` from `localhost` to `0.0.0.0` to listening on all network interfaces of your host.

# Installing Node-Red nodes
Node-Red nodes are installed as npm modules. With this project template, you have two options when installing new nodes.

1. Project Level

   Make sure you are in the main project folder and install using
	 `npm` as usual. Update your main project `package.json` file (or use `npm --save`).

	 This is the simplest approach and the one I use. However, it does mean that, if you want to run another node-red instance from the same project folder, you have to use the same installed modules.

2. User Level

   Change into your user folder (`./.nodered` by default) before using `npm`. You will need to do an `npm init -y` the first time as I haven't included a `package.json` file in that folder.

	 This seems to me to be more complex to manage. However, it does have the advantage that you can use the project (optionally with some shared nodes installed) with multiple instances each with their own nodes or different versions of the same nodes.

3. Developing node-red nodes
   
   If you use the setup to isolate the development of a node-red node you should use `npm link` to link and install to and from your original development directory (e.g. a seperate git-repository).  Use `npm run dev` to start the node-red instance with debugging features. See [npm scripts](#npm-scripts) for more information.


# NPM Scripts
```bash
npm run debug
```
Start node with active debuggin features and `NODE_ENV` set to `development` which will not minify RED.

```bash
npm run start
```
same as npm start, executing "node server.js"

```bash
npm run adminauth -- [your-password-here]
```
creates the hashsum for the provided password which you can use in settings.js for you user accounts.
if not given on commandline you will be asked

```bash
npm run selfsigned -- [commonName]
```
creates self-signed certificates for running https-Server. You need to provide the commonName (Domainname).
*WARNING:* The files server.key and server.crt will be overwritten if they are already existing.

# Recommended nodes

This is a list of common nodes usually installed afterwards:

```bash
npm install --save node-red-dashboard node-red-node-swagger
```
NOTE: 

# Running Multiple Instances of Node-Red
One of the key points of this project template is to be able to run multiple instances of Node-Red, even at different version levels. Great for testing new versions and proving they work before destroying your current version!

There are two options for running multiple instances:

1. From multiple project folders

   This is what I use most commonly. Each project folder contains a complete installation of Express, Node-Red and any other dependencies.

	 It has the advantage of simplicity. However, it has the disadvantage of requiring a lot more storage space on the host.

	 This approach keeps each instance entirely separate from the others and so is the easiest way to test new versions of Node-Red and other nodes.

2. From a single project folder

   It is also possible to run multiple instances from a single project folder. In this case, you need multiple start files not just the pre-defined server.js. You will also need multiple settings.js files.

	 You will have to also create another user folder and point the settings at it.

	 It would be possible to enhance the server.js to take a parameter so that you only needed the alternate settings file and user folder. Feel free to offer a pull request with this enhancement ;-)

	 The advantage of this approach is that you can share some nodes and node-red itself. Nodes specific to the instance can still be installed in the user folder (see below) so you still have a level of flexibility.

If running multiple instances, don't forget to set the required TCP port & user folder.

# Security
Because this template has Node-Red embedded into a standard ExpressJS web server, you should apply security using Express features rather than Node-Red.

This gives you far more control overall - however, if you need to provide read-only access to the Node-Red admin UI, you will also need to configure the Node-Red security, the settings are commented out in `settings.js`

# Advantages of the "embedded" approach
One of the key advantages to the "embedded" installation of node-red is that it follows the standard approach of all node.js applications and can be managed in the same way. You can update your project without needing root/admin privileges and you can run multiple instances with differing versions and dependencies without impacting "live" instances.

In addition, it is really not a good idea to install node.js applications to global (`sudo npm install -g ...`) as this gives the resulting application root privileges. Root/admin access may be needed for CLI applications but is rarely a good idea for servers like Node-Red and other HTTP based applications.

As time goes by, these problems can multiply too as you find yourself installing other modules such as additional nodes globally creating further security holes.

Finally, although the default installation method for Node-Red seems initially simpler, I've noted that a lot of time is taken up in the support forum with people losing track of installed files or ending up with duplicate files or incorrect permissions. All of this is avoided by taking control of the installation.

Hopefully this template will make it a lot easier for people to follow this method.

# Alternative approaches
Nathanaël Lécaudé has an interesting approach that uses sub-processes, see his GitHub repo at [natcl/node-red-project-template](https://github.com/natcl/node-red-project-template)

Nick O'Leary, one of the main IBM developers working on Node-Red also suggests creating a project folder with a simpler installation using the following `package.json`:
```json
{
    "name"         : "my-node-red-project",
    "version"      : "0.0.1",
    "dependencies": {
        "node-red": "~0.13.4",
    },
    "scripts": {
      "start": "node node_modules/node-red/red.js --userDir ./data"
    },
}
```
Most of the benefits are the same other than not having as much control over the Express server.

# To do
- Add "middleware" to secure http-in endpoints, e.g. via basic authentication (nrSettings.httpNodeAuth)
- Add optional code to include extended security using Passport
