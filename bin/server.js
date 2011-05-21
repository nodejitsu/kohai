//grab node-irc (available on npm)
var irc = require("irc")
fs = require("fs")
nconf = require("nconf")
//our bot is exportable
module.exports = function() {
  //grab our configuration for the bot
  //var config = require(__dirname+"/config.js")()
    nconf.use('file', { file: __dirname+'/../config.json' } )
    nconf.load()
    config = nconf.get('config')
    whitelist = config.plugins.alias.whitelist

  var client = new irc.Client(
    config.server || "irc.freenode.net"
  , config.nick   || "kohai"
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
    var handler = require(__dirname+"/../lib/plugins/"+module_name)
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
