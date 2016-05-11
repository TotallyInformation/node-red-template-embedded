# node-red-template-embedded
A template project for running Node-Red in "embedded" mode which is great if you want to run multiple instances of Node-Red or work collaboratively with others. Also lets you take control of the ExpressJS server.

# Release Notes
v0.0.3 Update readme - Added alternative approaches and a warning about version constraints

v0.0.2 Update readme - Added comment to configuration section of readme to inform that node-red-contrib-ui is installed. Initial testing also completed. Works on Windows 10 64bit with node.js v4.4.3 and Node-red v0.13.4. UI and http-in/out also tested.

v0.0.1 INITIAL RELEASE - I've not yet fully tested this. Please use with caution. Let me know of any issues.

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

# Configuration
This template project is pre-configured with the following default configuration:

- Default Node-Red TCP port of `1880`
- User folder set to `./.nodered`
- Flows file of `./.nodered/flows.json` (with the file set to "pretty" to make git diffs easier to work with)
- Static web folder set to `./public` (take care not to end up with a name clash between files/folders in public and http-in nodes)
- Default uri of `/`
- Default admin uri of `/admin`
- Verbose output on, logging level `info`
- node-red-contrib-ui is installed as standard
- I've *not* put any version constraints on either Node-Red or UI in `package.json`, you might want to add some to prevent future upgrade issues on a live installation
- Some other odds and ends either set to defaults or commented out for later use.

The default configuration should work on all platforms including Windows.

The Node-Red specific configuration is all in `settings.js`, simply change this to meet your own requirements.

Make changes to server.js if you need to add/change the ExpressJS server such as adding security using Passport.

# Installing Node-Red nodes
Node-Red nodes are installed as npm modules. With this project template, you have two options when installing new nodes.

1. Project Level

   Make sure you are in the main project folder and install using
	 `npm` as usual. Update your main project `package.json` file (or use `npm --save`).

	 This is the simplest approach and the one I use. However, it does mean that, if you want to run another node-red instance from the same project folder, you have to use the same installed modules.

2. User Level

   Change into your user folder (`./.nodered` by default) before using `npm`. You will need to do an `npm init -y` the first time as I haven't included a `package.json` file in that folder.

	 This seems to me to be more complex to manage. However, it does have the advantage that you can use the project (optionally with some shared nodes installed) with multiple instances each with their own nodes or different versions of the same nodes.

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
- Add template code for running under HTTPS instead of HTTP
- Add optional code to include extended security using Passport
