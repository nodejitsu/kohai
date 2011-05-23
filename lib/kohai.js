var irc = require("irc"),
    fs = require("fs"),
    colors = require("colors"),
    path = require("path"),
    nconf = require("nconf");
    
var kohai = exports;

kohai.start = function () {
  var confPath = path.existsSync(__dirname+'/../config.json');
  if (!confPath) {
    console.log('warn: config.json not detected.  Please either edit config.json before next start, or use the !config commands and !config save when finished.'.red);
    nconf.use('file', { file: __dirname+'/../config.json.defaults' });
    nconf.load();
    nconf.use('file', { file: __dirname+'/../config.json' });
  }
  else { 
    nconf.use('file', { file: __dirname+'/../config.json' });
    nconf.load();
  }

  config = nconf.get('config');
  whitelist = config.plugins.alias.whitelist;

  console.log('info: connecting to freenode. this will take a few moments and you might see an error message related to the cookies library.'.green);
  var client = new irc.Client(
      config.server || "irc.freenode.net"
    , config.nick   || "kohai"
    , config
  );

  client.on("error",function() {
    console.log(arguments)
  });

  client.conf = function(key, val) {
    if (val) {
      nconf.set('config:' + key, val)
      config = nconf.get('config')
      client.emit('config', config)
    }
    else {
      return nconf.get('config:' + key)
    }
  }

  client.saveConfig = function(callback) {
    nconf.save(function(err) {
      if (err) {
        console.error('failed to save config: ' + err)
      }
      callback(err)
    })
  }

  var modules = config.modules
    //load all of the modules our bot uses
  modules.forEach(function(module_name){
    //get the modules from the modules directory relative to where *this* script lives
    var handler = require(__dirname+"/../lib/plugins/"+module_name)
    if(typeof handler === "function") {
      handler.call(client, config)
    }

  });

  return client;
  
};

