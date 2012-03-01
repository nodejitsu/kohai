/*
 *
 * router.js - This should contain a director router or similar for handling
 * "triggers."
 *
 * (c) 2012 Nodejitsu Inc.
 *
 */

// Mostly copy-pasted from the cli router from director core.
var util = require('utile'),
    director = require('director');

var Router = exports.Router = function (routes) {
  director.Router.call(this, routes);
  this.recurse = 'backward';
};

//
// Inherit from `director.Router`.
//
util.inherits(Router, director.Router);

//
// ### function configure (options)
// #### @options {Object} **Optional** Options to configure this instance with
// Configures this instance with the specified `options`.
//
Router.prototype.configure = function (options) {
  options = options || {};
  director.Router.prototype.configure.call(this, options);
  
  //
  // Our delimiter here is a space.
  // e.g. `!foo bar baz`
  //
  this.delimiter = ' ';

  // This way, you can use a custom trigger symbol.
  // e.g. `@foo bar baz`
  this.trigger = options.trigger || '!';

  return this;
};

//
// ### function dispatch (method, path)
// #### @method {string} Method to dispatch
// #### @path {string} Path to dispatch
// Finds a set of functions on the traversal towards
// `method` and `path` in the core routing table then 
// invokes them based on settings in this instance.
//
Router.prototype.dispatch = function (method, path, callback) {

  //
  // Replace the trigger with a space so that the traversal
  // algorithm will recognize it. This is because we always assume
  // that the `path` begins with `this.delimiter`. 
  //
  path = path.replace(new RegExp('^'+this.trigger), this.delimiter);

  var fns = this.traverse(method, path, this.routes, '');

  if (!fns || fns.length === 0) {

    if (callback) {
      callback(new Error('Could not find path: ' + path));
    }
    
    return false;
  }
  
  if (this.recurse === 'forward') {
    fns = fns.reverse();
  }

  // Second arg is set to "this" in the route handler.  
  this.invoke(this.runlist(fns), { cmd: path.substring(1) }, callback);
  return true;
};
