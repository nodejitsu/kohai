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

};

Kohai.prototype.input = function (data) {
  console.log('got input', data);
}

