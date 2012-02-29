/*
 *
 * kohai.js - The Kohai core.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var util = require('utile'),
    fs = require('fs');

exports.attach = function (options) {

  // sync loading of plugins goes here

  //eg:
  // this.use(someOtherPlugin, itsOptions);

  // lazy loading of plugins from a directory should go here

  this.hook.on('hook::ready', function () {
    // Hook ready
  });


};

exports.init = function (done) {
  // Any async stuff we need to do should happen here.
  done();
};

// TODO: Refactor this stuff to work with flatiron and this.hook .
/*

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

Kohai.prototype.loadPluginsfunction loadPlugins () {

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
*/
