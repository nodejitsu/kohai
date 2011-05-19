var irc = require("irc")
    arghelper = require("../lib/utils/arguments.js")
    fs = require("fs")
    nconf = require("nconf")
console.log("module got found...")
require.paths.unshift(__dirname)

var kohai = module.exports = function () {
  nconf.use('file', { file: __dirname+'/../config.json' })
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

