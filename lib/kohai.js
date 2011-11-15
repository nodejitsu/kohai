/*
 *
 * kohai.js - The Kohai core.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var Hook = require('hook.io').Hook,
    Channel = require('./channel').Channel,
    fs = require('fs'),
    util = require('util');

var Kohai = exports.Kohai = function (options) {
  var self = this;
  Hook.call(this, options);
  self.on('hook::ready', function () {

    //
    // If running as root and we've been provided a uid, 
    // switch to that user
    //
    if ((process.getuid() === 0) && self.uid) {
      process.setuid(self.uid);
    }

    self.loadPlugins();
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

