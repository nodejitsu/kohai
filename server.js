//grab node-irc (available on npm)
var irc = require("irc")
arghelper = require("./utils/arguments.js") //this can either go into ./plugins/alias.js or stay here with no 'var'

//our bot is exportable
module.exports = function() {
	//grab our configuration for the bot
	var config = require(__dirname+"/config.js")()

	//ok all of our stuff is ready to start up the bot
	var client = new irc.Client(
		config.server || "irc.freenode.net"
		, config.name || "kohai"
		, config
	)
	
	
	client.on("error",function() {
		console.log(arguments)
	})

	//modules are similar to plugins
	var modules = config.modules

	//load all of the modules our bot uses
	modules.forEach(function(module_name){

		//get the modules from the modules directory relative to where *this* script lives
		var handler = require(__dirname+"/plugins/"+module_name)
		if(typeof handler === "function") {
			handler.call(client, config)
		}

	})

	return client;
}

//run this if it was the main file loaded in by node
if(require.main) {
	module.exports()
}
