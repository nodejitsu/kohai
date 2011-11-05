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
    util = require('util'),
    plugins = require('./plugins'),
    comments = require('./comments');

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

    self.ranks = self.config.get('ranks');
    
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
      if(typeof self.plugins[plugin].init !== 'undefined'){
       self.plugins[plugin].init(self); 
      }
    } catch (err) {
      console.log('Plugin.init  error: '.red + plugin.blue + ' ' + err.message);
    }
    
    try {
      Object.keys(self.plugins[plugin].commands).forEach(function(command){
        self.on('**::kohai::' + command, function(data, cb){
          self.plugins[plugin].commands[command](data, self, cb);
        });
      });
      
    } catch (err) {
      
    }
    

    
  });

  //console.log(self.plugins);
  self.on('output', function(data){
    console.log(this.event, data);
    
    self.emit('irc::msg', data);
    
  });
};

Kohai.prototype.input = function (data) {
  console.log('got input', data);
}

Kohai.prototype.checkAuth = function (data) {
  
  console.log('check auth');
  
  var self = this,
      access = self.config.get('access'),
      inherit = false;
  self.ranks.forEach(function (rank) {
    // No message should have any rank fields prior to this function.
    if (typeof data[rank] !== 'undefined') {
      return false;
    }
  });
  self.ranks.forEach(function (level) { 
    if (inherit) { 
      data[level] = true;
      return;
    }
    access[level].forEach(function (name) {
      if (name === data.nick) {
        data[level] = true;
        inherit = true;
      }
    });
  });
  if (data.to === self.nick) { 
    return self._dispatchPM(data);
  }
  return self._dispatcher(data);
}

Kohai.prototype._dispatcher = function (data) {
  var self = this,
      replace = self.idCheck 
                ? '+' + self.channels[data.to].commandString 
                : self.channels[data.to].commandString,
      command = data.text.replace(replace, '').split(' ');
  if ((command[0] !== 'config')&&(typeof triggers[command[0]] !== 'undefined')) {
    triggers[command[0]].call(self, data, command);
  }
}

Kohai.prototype._dispatchPM = function (data) {
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
}

Kohai.prototype.checkComment = function (data) {
  comments.call(this, data);
}


function _lazyLoad() {
  var self = this;
  fs.readdirSync(__dirname + '/listeners').forEach(function (listener) {
    var mod;
    if (/^.*\.js$/.test(listener)) {
      listener = listener.replace('.js', '');
      try {
        var mod = require(__dirname + '/listeners/' + listener);
        switch(typeof mod) {
          case 'function':
            mod.call(self);
            break;
          case 'object':
            Object.getOwnPropertyNames(mod).forEach(function (item) {
              if (typeof mod[item] === 'function') {
                mod[item].call(self);
              }
              else {
                console.log('Cannot load non-function as event listener: %s.%s', listener, item);
              }
            });
            break;
          default:
            console.log('Cannot load non-functions as event listeners.');
            break;
        }
      }
      catch (err) {
        console.log('Listener plugin \'%s\' was not loaded due to error: %s', listener, err.message);
      }
    }
  });
}
