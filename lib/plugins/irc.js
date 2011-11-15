/*
 *
 * support.js - send support emails from the IRC.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

exports.attach = function () {

};

exports.init = function () {

  //
  // Map commands to hook.io events
  //

};

exports.commands = {
  



};


module['exports'] = function (kohai) {

  kohai.on('**::irc::msg', function(data){
    
    //
    // First, determine role of user talking
    //
    data.nick
    
    //
    // Second, determine where to send it
    //
    data.to
    
    //
    // This, parse the incoming message for commands / events
    //
    data.text
    
    console.log(this.event, data);
    
  });

};
return;
/*


Kohai.prototype.joinChannel = function (channel) {
  var self = this;
  if (!self.channels) {
    self.channels = {};
  }
  if (typeof self.channels[channel] === 'undefined') {
    self.channels[channel] = new Channel(self.channelDefaults);
  }
  else {
    self.channels[channel].join();
  }
  if (self.channels[channel].autoVolume) {
    self.channels[channel].startVolume();
  }
}



var idCheck = this.idCheck ? '\\+' : '',
    trigger = new RegExp('^' 
      + idCheck 
      + this.channels[data.to].commandString
      + '\\w+\\s?\\w*.*');
      
      
this.channels[data.to].messageCount++;
if (trigger.test(data.text)) {
  this.checkAuth(data);
}
else if (/^-!?(help|support)/.test(data.text)) {
  var command = data.text.replace(/-!/, '').split(' ');
  triggers[command[0]].call(this, data, command);
}
else {
  this.checkComment(data);
}





var fs = require('fs');

var listeners = exports;

listeners.init = function () {
  var self = this;

  self.on('*::idCheck', function (data) {
    self.idCheck = data.check ? true : false;
  });
  
  self.on('*::gotMessage', function (data) {
    if (data.to === self.nick) {
      return self.checkAuth(data);
    }
    return self.gotMessage(data);
  });

  self.on('*::Isaid', function (data) {
    if (data.to[0] === '#') {
      self.channels[data.to].messageCount++;
    }
  });

  self.on('*::Ijoined', function (data) {
    self.joinChannel(data.channel);
  });

  self.on('*::userJoined', function (data) {
    var access = self.config.get('access');
    access.employee.forEach(function (name) {
      if (data.nick === name) {
        self.emit('command', 'mode ' + data.channel + ' +v ' + data.nick);
        return;
      }
    });
  });

  self.on('*::Iparted', function (data) {
    if (typeof self.channels[data] !== 'undefined') {
      self.channels[data].part();
      self.channels = self.channels.filter( function (item) {
        return item !== data;
      });
    }
  });
  


  self.on('*::error::*', function (data) {
    console.log(data);
  });

  _lazyLoad.call(self);
}



self.channels.forEach(function (channel) {
  self.joinChannel(channel);
});





'stfu' : function (data, callback) {
  if (!data[this.ranks[1]]) { return false; }
  var self = this,
      dest = (isNaN(parseInt(command[2]))) ? command[2] : data.to,
      timer = (command[3] && !isNaN(parseInt(command[3]))) ? // If command[3] is a number,
        parseInt(command[3]) : // parse it as an int and use it.
          !isNaN(parseInt(command[2])) ? // Otherwise, if command[2] is a number,
          parseInt(command[2]) : // try to parse command[2] as an int;
          60; // if that fails as well, the default timer is 60 seconds.
  self.emit('sendMsg', { 
    dest: dest, 
    msg: 'Gross Adjusted Noobosity of ' + command[1] 
      + ' has exceeded specified telemetry parameters.  Irrevocable ' 
      + timer + ' second mute has been initiated.'
  });
  self.emit('command', 'mode ' + dest + ' +q ' + command[1]);
  setTimeout(function () {
    self.emit('command', 'mode ' + dest + ' -q ' + command[1]);
    self.emit('sendMsg', { 
      dest: dest, 
      msg: 'Noobosity telemetry data now below thresholds.  Removing mute for ' + command[1] + '.'
    });
  }, timer * 1000);
},

'gtfo': function (data, callback) {
  if (!data[this.ranks[0]]) { return false; }
  this.emit('hook::exit', null);
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

*/



