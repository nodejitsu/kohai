/*
 *
 * irc.js - broadway plugin for basic irc management in kohai.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

// TODO: Refactor these supporting libraries as necessary.
var Channel = require('../channel').Channel,
    triggers = require('../triggers'),
    listeners = require('../listeners'),
    comments = require('../comments');

exports.attach = function (options) {
  var self = this;

  self.options = options || {};

  // Initialization to occur on hook::ready
  self.hook.on('hook::ready', function () {
    if ((process.getuid() === 0) && self.uid) {
      process.setuid(self.uid);
    }
    self.channels.forEach(function (channel) {
      self.joinChannel(channel);
    });
    listeners.init.call(self, null);
    self.insults = self.config.get('insults');
    self.ranks = self.config.get('ranks');
  });

  // Join a channel.
  self.joinChannel = function joinChannel(channel) {

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
  };

  // Message handler.
  self.gotMessage = function gotMessage(data) {
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
  };

  // Auth checking function.
  self.checkAuth = function (data) {
    var access = self.config.get('access'),
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
  };

  // Dispatches to triggers. TODO: Refactor to be more awesome.
  self._dispatcher = function (data) {
    var self = this,
        replace = self.idCheck 
                  ? '+' + self.channels[data.to].commandString 
                  : self.channels[data.to].commandString,
        command = data.text.replace(replace, '').split(' ');
    if ((command[0] !== 'config')&&(typeof triggers[command[0]] !== 'undefined')) {
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

  // TODO: Figure out what this does.
  self.checkComment = function (data) {
    comments.call(self, data);
  };

  // TODO: Try to consolidate tweeting into its own plugin.
  self.sayTweet = function (data) {

    Object.getOwnPropertyNames(self.channels).forEach(function (channel) {
      if (self.channels[channel].wantsTweets === 'true') {
        if ((self.channels[channel].volume / 2) > self.channels[channel].currentTweetCount) {
          self.hook.emit('sendMsg', {dest: channel, msg: data});
          self.channels[channel].currentTweetCount++;
        }
      }
    });
  };

};


exports.init = function (done) {

  //
  // Async steps.
  //

  done();

};
