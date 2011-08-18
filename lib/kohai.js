/*
 *
 * kohai.js - The Kohai core.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var Hook = require('hook.io').Hook,
    Channel = require('./channel').Channel,
    util = require('util'),
    triggers = require('./triggers');

var Kohai = exports.Kohai = function (options) {
  for (var o in options) {
    this[o] = options[o];
  }
  Hook.call(this);
  var self = this; 
  self.on('hook::ready', function () {
    if ((process.getuid() === 0) && self.uid) {
      process.setuid(self.uid);
    }
    self._initHook();
    self.insults = self.config.get('insults');
  });
}
util.inherits(Kohai, Hook);

Kohai.prototype._initHook = function () {
  var self = this;

  // hook.spawn should go here

  self.on('*::ircConnected', function (data) {
    self.ircNick = data.ircNick;
    data.channels.forEach(function (channel) {
      self.joinChannel(channel);
    });
  });

  self.on('*::idCheck', function (data) {
    self.idCheck = data.check ? true : false;
  });

  self.on('*::keptTweet', function (data) {
    self.sayTweet(data);
  });
  
  self.on('*::gotMessage', function (data) {
    if (data.to === self.ircNick) {
      return self.checkAuth(data);
    }
    self.gotMessage(data);
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
    if (self.channels[data]) {
      self.channels[data].part();
      self.channels = self.channels.filter( function (item) {
        return item !== data;
      });
    }
  });

  self.on('*::reported', function (data) {
    self.emit('sendMsg', {dest: data.to, msg: 'I have reported ' + data.name + ' as a spammer.'});
  });

  self.on('*::blocked', function (data) {
    self.emit('sendMsg', {dest: data.to, msg: 'I have blocked ' + data.name + '.'});
  });

  self.on('*::error::*', function (data) {
    console.log(data);
  });
}

Kohai.prototype.joinChannel = function (channel) {
  var self = this;
  if (!self.channels) {
    self.channels = {};
  }
  if (!(channel in self.channels)) {
    var options = {
      commandString: '!',
      messageCount: 0,
      currentTweetCount: 0,
      volume: 10,
      lastVolume: 10,
      rate: 0,
      autoVolume: true,
      active: true
    };
    self.channels[channel] = new Channel(options);
  }
  else {
    self.channels[channel].join();
  }
  if (self.channels[channel].autoVolume) {
    self.channels[channel].startVolume();
  }
}

Kohai.prototype.gotMessage = function (data) {
  var idCheck = this.idCheck ? '\\+' : '',
      trigger = new RegExp('^' + idCheck + this.channels[data.to].commandString + '\\w+\\s?\\w*.*');
  this.channels[data.to].messageCount++;
  if (trigger.test(data.text)) {
    this.checkAuth(data);
  }
  else {
    this.checkComment(data);
  }
}

Kohai.prototype.checkAuth = function (data) {
  var self = this,
      access = self.config.get('access'),
      inherit = false;

  if (data.admin || data.employee || data.friend) {
    // If the incoming message has a rank field already,
    // this message is likely hax and can GTFO.
    return false; 
  }

  Object.keys(access).sort(function (a, b) {
    return rankOf(b) - rankOf(a);
  }).forEach(function (level) { 
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

  function rankOf (x) { 
    return { 
      admin : 0, 
      employee : 1, 
      friend : 2 
    }[x] 
  }

  if (data.to === self.ircNick) { return self._dispatchPM(data) }
  return self._dispatcher(data);
  
}




Kohai.prototype._dispatcher = function (data) {
  var self = this,
      replace = self.idCheck 
                ? '+' + self.channels[data.to].commandString 
                : self.channels[data.to].commandString,
      command = data.text.replace(replace, '').split(' ');
  if ((command[0] !== 'config')&&(command[0] in triggers)) {
    triggers[command[0]].call(self, data, command);
  }
}

Kohai.prototype._dispatchPM = function (data) {
  var config = /^config\s(add|rm|set|get|save)\s?([\w\d#:._]*)\s?(.*)$/,
      text = data.text.replace(/^\+/, ''),
      command;
  if (!config.test(text)) {
    command = text.split(' ');
    if (command[0] in triggers) {
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
  if (/\bkohai\b.*\bbot\b.*/i.test(data.text)) {
    this.emit('sendMsg', {
      dest: data.to, 
      msg: '\'Bot\' is a derogatory term, and I\'m offended.' 
    });
  }
  else if (/.*\bkohai:(?:\s|$).*/i.test(data.text)) {
    this.emit('sendMsg', {
      dest: data.to, 
      msg: 'I am Kohai, semi-useful communications-facilitating pseudointelligence!' 
    });
  }
}

Kohai.prototype.sayTweet = function (data) {
  var self = this;
  Object.getOwnPropertyNames(self.channels).forEach(function (channel) {
    if ((self.channels[channel].volume / 2) > self.channels[channel].currentTweetCount) {
      self.emit('sendMsg', {dest: channel, msg: data});
      self.channels[channel].currentTweetCount++;
    }
    else { util.debug('Volume test failed for tweet: ' + data) }
  });
}

