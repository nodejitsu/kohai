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
  var self = this,
      chans = self.get('channels');
  self.channels = chans ? chans : {}; 
  self.on('ready', function () {
    self._initHook();
    self.insults = self.get('insults');
  });
}
util.inherits(Kohai, Hook);

Kohai.prototype._initHook = function () {
  var self = this;

  self.spawn(['twitter', 'irc'], function (err, message) {
    if (err) { return console.log(err) }
    // console.log(message);
  });

  self.on('i.ircConnect.o.ircConnect', function (fullEvent, event, data) {
    self.ircNick = data.ircNick;
    data.channels.forEach(function (channel) {
      self.joinChannel(channel);
    });
  });

  self.on('i.keptTweet.o.keptTweet', function (fullEvent, event, data) {
    self.sayTweet(data);
  });
  
  self.on('i.message.o.message', function (fullEvent, event, data) {
    if (data.to === self.ircNick) {
      data.pm = true;
      return self.checkAuth(data);
    }
    self.channels[data.to].messageCount++;
    var idCheck = self.idCheck ? '\\+' : '',
        trigger = new RegExp('^' + idCheck + self.channels[data.to].commandString + '\\w+\\s?\\w*.*');
    if (trigger.test(data.text)) {
      self.checkAuth(data);
    }
  });

  self.on('i.Isaid.o.Isaid', function (fullEvent, event, data) {
    if (data.to[0] === '#') {
      self.channels[data.to].messageCount++;
    }
  });

  self.on('i.Ijoined.o.Ijoined', function (fullEvent, event, data) {
    self.joinChannel(data.channel);
  });

  self.on('i.userJoined.o.userJoined', function (fullEvent, event, data) {
    var access = self.get('access');
    access.admin.forEach(function (name) {
      if (data.nick === name) {
        self.emit('i.command.o.command', 'mode ' + data.channel + ' +o ' + data.nick);
        return;
      }
    });
    access.ninja.forEach(function (name) {
      if (data.nick === name) {
        self.emit('i.command.o.command', 'mode ' + data.channel + ' +v ' + data.nick);
        return;
      }
    });
  });

  self.on('i.Iparted.o.Iparted', function (fullEvent, event, data) {
    if (self.channels[data]) {
      self.channels[data].part();
    }
  });

  self.on('i.reported.o.reported', function (fullEvent, event, data) {
    self.emit('i.sendMsg.o.sendMsg', 
      {dest: data.to, msg: 'I have reported ' + data.name + ' as a spammer.'});
  });

  self.on('i.blocked.o.blocked', function (fullEvent, event, data) {
    self.emit('i.sendMsg.o.sendMsg', 
      {dest: data.to, msg: 'I have blocked ' + data.name + '.'});
  });
}

Kohai.prototype.joinChannel = function (channel) {
  var self = this;
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

Kohai.prototype.checkAuth = function (data) {
  var self = this,
      access = self.get('access'),
      inherit = false;
  for (var level in access) {
    if (inherit) { 
      data[level] = true;
      continue; 
    }
    access[level].forEach(function (name) {
      if (name === data.nick) {
        data[level] = true;
        inherit = true;
      }
    });
    if (!data[level]) { data[level] = false; }
  }
  if (data.pm) { return self._dispatchPM(data) }
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
  var config = /^config\s(add|rm|set|get|save)\s?([\w\d#:\._]*)\s?(.*)/,
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


Kohai.prototype.sayTweet = function (data) {
  var self = this;
  Object.getOwnPropertyNames(self.channels).forEach(function (channel, i) {
    if ((self.channels[channel].volume / 2) > self.channels[channel].currentTweetCount) {
      console.log(channel, '\'s Tweets: ', self.channels[channel].currentTweetCount);
      self.emit('i.sendMsg.o.sendMsg', {dest: channel, msg: data});
      self.channels[channel].currentTweetCount++;
    }
    else { util.debug('Volume test failed for tweet: ' + data) }
  });
}



