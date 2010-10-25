//grab node-irc (available on npm)
var irc = require("irc")
var arghelper = require("./utils/arguments.js")

//our bot is exportable
module.exports = function() {
	//grab our configuration for the bot
	var config = require(__dirname+"/config.js")()

	//ok all of our stuff is ready to start up the bot
	var client = new irc.Client(
		config.server || "irc.freenode.net"
		, config.name || "bmeckbot"
		, config
	)
	
	client.triggers = {}
	client.on("message",function triggerListener(name,to,message) {
		var trigger_match = message.match(/^[!](\S+)(.*|$)?/)
		if(trigger_match) {
			var trigger = trigger_match[1]
			
			var handler = client.triggers[trigger]
			if(handler) {
				var args = arghelper(trigger_match[2])
				handler.apply(client,[name,to,message].concat(args));
			}
		}
	})
	client.on("error",function() {
		console.log(arguments)
	})

	//modules are similar to plugins
	var modules = config.modules

	//load all of the modules our bot uses
	modules.forEach(function(module_name){

		//get the modules from the modules directory relative to where *this* script lives
		var handler = require(__dirname+"/modules/"+module_name)
		if(typeof handler === "function") {
			handler.call(client, config)
		}

	})

	//connect to the server
	client.connect();

	return client;
}

//run this if it was the main file loaded in by node
if(require.main) {
	module.exports()
}
