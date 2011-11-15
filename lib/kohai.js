/*
 *
 * kohai.js - The Kohai core.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var Hook = require('hook.io').Hook,
    fs = require('fs'),
    util = require('util');

var Kohai = exports.Kohai = function (options) {
  var self = this;
  Hook.call(this, options);
  
  //
  // Load plugins from /plugins/ directory ( syncronous operation )
  //
  self.loadPlugins();

  self.on('hook::ready', function () {
    //
    // Hook ready
    //
  });

}
util.inherits(Kohai, Hook);

Kohai.prototype.loadPlugins = function () {
  
  var self = this;
  
  self.plugins = {};
  
  fs.readdirSync(__dirname + '/plugins').forEach(function (plugin) {
    
    //
    // Attempt to require the plugin
    //
    try {
      self.plugins[plugin] = require('./plugins/' + plugin);
    } catch (err) {
      console.log('Pluging loading error: '.red + plugin.blue + ' ' + err.message);
    }
    
    //
    // Attempt to call Plugin.init()
    //
    try {
      self.plugins[plugin](self); 

      if(typeof self.plugins[plugin].init !== 'undefined'){
      }
    } catch (err) {
      console.log('Plugin.init  error: '.red + plugin.blue + ' ' + err.message);
    }
    
    try {
      Object.keys(self.plugins[plugin].commands).forEach(function(command){
        /*
        self.on('**::kohai::' + command, function(data, cb){
          self.plugins[plugin].commands[command](data, self, cb);
        });
      */
      });
      
    } catch (err) {
      
    }
    
  });

};

Kohai.prototype.input = function (data) {
  console.log('got input', data);
}

