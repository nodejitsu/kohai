/*
 *
 * kohai.js - The Kohai core.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var Hook = require('hook.io').Hook,
    fs = require('fs'),
    broadway = require('broadway'),
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

  var app = new broadway.App();

  fs.readdirSync('./lib/plugins').forEach(function(plugin, i){
    try {
      app.use(require('./plugins/' + plugin), { "delimiter": "!" } );
      
    } catch (err) {
      console.log('error loading ' + plugin);
    }
  });
  

  // Passes the second argument to `helloworld.attach`.



};

Kohai.prototype.input = function (data) {
  console.log('got input', data);
}

