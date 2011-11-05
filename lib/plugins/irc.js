var irc = {};

irc = exports;
return;

//
// Listen for IRC hook events
//



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

  /*
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
  
  */

  self.on('*::error::*', function (data) {
    console.log(data);
  });

  _lazyLoad.call(self);
}



self.channels.forEach(function (channel) {
  self.joinChannel(channel);
});
