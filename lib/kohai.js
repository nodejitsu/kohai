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
    triggers = require('./triggers'),
    listeners = require('./listeners'),
    comments = require('./comments');

var Kohai = exports.Kohai = function (options) {
  for (var o in options) {
    this[o] = options[o];
  }
  Hook.call(this);
  var self = this; 
  self.hooks = ['irc', 'twitter', 'mailer'];
  self.on('hook::ready', function () {
    if ((process.getuid() === 0) && self.uid) {
      process.setuid(self.uid);
    }
    self.channels.forEach(function (channel) {
      self.joinChannel(channel);
    });
    listeners.init.call(self, null);
    self.insults = self.config.get('insults');
  });
}
util.inherits(Kohai, Hook);

Kohai.prototype.joinChannel = function (channel) {
  var self = this;
  if (!self.channels) {
    self.channels = {};
  }
  if (!(channel in self.channels)) {
    self.channels[channel] = new Channel(self.channelDefaults);
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
      trigger = new RegExp('^' 
        + idCheck 
        + this.channels[data.to] ? this.channels[data.to].commandString : '' 
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
  Object.getOwnPropertyNames(access).sort(function (a, b) {
    return rankOf(a) - rankOf(b);
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
  var config = /^config\s(add|rm|set|get|save)\s?([\w\d#:._-]*)\s?(.*)$/,
      text = data.text.replace(/^\+!?/, ''),
      command;
  if (!config.test(text)) {
    command = text.split(' ');
    if (/-!(help|support)/.test(command[0])) {
      triggers[command[0].slice(1)].call(this, data, command);
    }
    else if (command[0] in triggers) {
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

Kohai.prototype.sayTweet = function (data) {
  var self = this;
  Object.getOwnPropertyNames(self.channels).forEach(function (channel) {
    if (self.channels[channel].wantsTweets) {
      if ((self.channels[channel].volume / 2) > self.channels[channel].currentTweetCount) {
        self.emit('sendMsg', {dest: channel, msg: data});
        self.channels[channel].currentTweetCount++;
      }
    }
  });
}

