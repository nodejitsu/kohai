var irc = require("irc"),
    fs = require("fs"),
    colors = require("colors"),
    path = require("path"),
    nconf = require("nconf");
    
var kohai = exports;

kohai.getConfig = function () {
  //Pull configuration info from config.json, but take it from config.json.defaults if config.json not present
  var confPath = path.existsSync(__dirname+'/../config.json');
    if (!confPath) {
      console.log('warn: config.json not detected.  Please either edit config.json before next start, or use the !config commands and !config save when finished.'.red);
      nconf.use('file', { file: __dirname+'/../config.json.defaults' });
      nconf.load();
      nconf.store.file = __dirname+'/../config.json';
    }
    else { 
      nconf.use('file', { file: __dirname+'/../config.json' });
      nconf.load();
    }
  
  return nconf.get('config');
}

kohai.start = function (config) {
  

  console.log('info: connecting to '+(config.server||'irc.freenode.net')+'. this will take a few moments and you might see an error message related to the cookies library.'.green);
  var client = new irc.Client(
      config.server || "irc.freenode.net"
    , config.nick   || "kohai"
    , config
  );

  client.on("error",function() {
    console.log(arguments);
  });

  client.conf = function(key, val) {
    if (val) {
      nconf.set('config:' + key, val)
      config = nconf.get('config')
      //client.emit('config', config)
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
    });
  }
  
 
  
  kohai.plugins = initPlugins();
  //There's probably a more elegant solution to this - this was the first one I found.
  Object.getOwnPropertyNames(kohai.plugins).forEach( function (module) {
    try {
      kohai.plugins[module].start(client, config);
    }
    catch (err) {
      console.error('Failed to load module ' + module + ': ' + err);
      process.exit(1);
    }
  });

  return client;
  
};

function initPlugins() {
  var plugins = {};
  fs.readdirSync(__dirname + '/plugins').forEach(function (plugin) {
    if (plugin.match(/^.*\.js$/)) {
      plugin = plugin.replace('.js', '');
      plugins.__defineGetter__(plugin, function () {
        return require(__dirname + '/plugins/' + plugin);
      });
    }
  });
  return plugins;
}