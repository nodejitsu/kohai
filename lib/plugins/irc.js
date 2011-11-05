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



,

'join' : function (data, command) {
  if (!data[this.ranks[0]]) { return false; }
  this.emit('join', command[1]);
},

'part' : function (data, command) {
  if (!data[this.ranks[0]]) { return false; }
  var channel = command[1] || data.to;
  this.emit('part', channel);
},

'voice' : function (data, command) {
  if (!data[this.ranks[0]]) { return false }
  var dest = command[2] || data.to;
  this.emit('sendMsg', { dest: dest, msg: 'I declare you cool, ' + command[1] + '!' });
  this.emit('command', 'mode ' + dest + ' +v ' + command[1]);
},

'devoice' : function (data, command) {
  if (!data[this.ranks[0]]) { return false }
  var dest = command[2] || data.to;
  this.emit('sendMsg', { dest: dest, msg: 'No more voice for you, ' + command[1] + '!' });
  this.emit('command', 'mode ' + dest + ' -v ' + command[1]);
},

'op' : function (data, command) {
  if (!data[this.ranks[0]]) { return false }
  var dest = command[2] || data.to;
  this.emit('command', 'mode ' + dest + ' +o ' + command[1]);
},

'deop' : function (data, command) {
  if (!data[this.ranks[0]]) { return false }
  var dest = command[2] || data.to;
  this.emit('command', 'mode ' + dest + ' -o ' + command[1]);
},

'kick' : function (data, command) {
  if (!data[this.ranks[1]]) { return false; }
  var dest = command[2] || data.to;
  console.log(command[1], ' has been kicked from ', dest);
  this.emit('sendMsg', { dest: dest, msg: 'kohai says GTFO!' });
  this.emit('command', 'kick ' + dest + ' ' + command[1]);
},

'ban' : function (data, command) {
  if (!data[this.ranks[0]]) { return false; }
  var dest = command[2] || data.to;
  console.log(command[1], ' has been banned from ', dest, ' at the request of ', data.nick);
  this.emit('sendMsg', { dest: dest, msg: 'BEHOLD THE MIGHT OF THE BANHAMMER!!!' });
  this.emit('command', 'mode ' + dest + ' +b ' + command[1]);
  this.emit('command', 'kick ' + dest + ' ' + command[1]);
},

'unban' : function (data, command) {
  if (!data[this.ranks[0]]) { return false; }
  var dest = command[2] || data.to;
  console.log(command[1], ' has been unbanned from ', dest, ' at the request of ', data.nick);
  this.emit('sendMsg', { dest: dest, msg: 'Mercy has been bestowed upon ' + command[1] });
  this.emit('command', 'mode ' + dest + ' -b ' + command[1]);
},

'stfu' : function (data, command) {
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

'gtfo': function (data, command) {
  if (!data[this.ranks[0]]) { return false; }
  this.emit('hook::exit', null);
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

