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
  this.delimiter = '\\s';

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



/*

  //
  // This is the original handler for messages.
  //
  hook.on('*::gotMessage', function (data) {

    // check auth if message is a PM to Kohai.
    if (data.to === self.nick) {
      return self.checkAuth(data);
    }

    // Otherwise, use the gotMessage handler.
    return self.gotMessage(data);
  });

  self.gotMessage = function gotMessage(data) {

    // What is an idCheck?
    var idCheck = self.idCheck ? '\\+' : '',
        trigger = new RegExp('^' 
          + idCheck 
          + this.channels[data.to].commandString // What is this?
          + '\\w+\\s?\\w*.*');

    // Count messages for the purposes of twitter
    self.channels[data.to].messageCount++;

    // This appears to be doing some basic routing.
    if (trigger.test(data.text)) {
      self.checkAuth(data);
    } // Triggers requests for help and support. TODO: Refactor out.
    else if (/^-!?(help|support)/.test(data.text)) {
      var command = data.text.replace(/-!/, '').split(' ');
      triggers[command[0]].call(this, data, command);
    }
    else {
      self.checkComment(data);
    }
  };

  // Dispatches to triggers. TODO: Refactor to be more awesome.
  self._dispatcher = function (data) {

    var replace = self.idCheck 
                  ? '+' + self.channels[data.to].commandString 
                  : self.channels[data.to].commandString,
        command = data.text.replace(replace, '').split(' ');

    if ( (command[0] !== 'config')
    && (typeof triggers[command[0]] !== 'undefined') ) {
      triggers[command[0]].call(self, data, command);
    }
  };

  // Dispatch behavior for PMs
  // TODO: Refactor to be more awesome.
  self._dispatchPM = function (data) {
    var config = /^config\s(add|rm|set|get|save)\s?([\w\d#:._-]*)\s?(.*)$/,
        text = data.text.replace(/^\+!?/, ''),
        command;
    if (!config.test(text)) {
      command = text.split(' ');
      if (/-!(help|support)/.test(command[0])) {
        triggers[command[0].slice(1)].call(this, data, command);
      }
      else if (typeof triggers[command[0]] !== 'undefined') {
        data.to = data.nick;
        triggers[command[0]].call(this, data, command);
      }
    }
    else if (data.admin) { 
      command = text.match(config);
      triggers.config.call(this, data.nick, command[1], command[2], command[3]);
    }
  };


