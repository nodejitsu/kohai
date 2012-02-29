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
    comments = require('../comments');

exports.name = 'kohai-irc';

exports.attach = function kohaiIrc (options) {
  var self = this,
      hook;

  self.options = options || {};

  if (!self.hook) {
    throw new Error('This plugin depends on flatiron-hook.');
  }
  else {
    hook = self.hook;
  }

  // Initialization to occur on hook::ready
  hook.on('hook::ready', function () {

    // TODO: Document what this does.
    if ((process.getuid() === 0) && self.uid) {
      process.setuid(self.uid);
    }

    // Join channels on 'self.channels'.
    // TODO: use `self.config.get`?
    self.channels.forEach(function (channel) {
      self.joinChannel(channel);
    });

    // TODO: Refactor into "insults" and "ranks" plugins?
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


  // Handle messages here.
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

  // Auth checking function. Appears to also be doing some basic routing?
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

  // TODO: Figure out what this does.
  self.checkComment = function (data) {
    comments.call(self, data);
  };

  // TODO: Try to consolidate tweeting into its own plugin.
  self.sayTweet = function (data) {

    Object.getOwnPropertyNames(self.channels).forEach(function (channel) {
      if (self.channels[channel].wantsTweets === 'true') {
        if ((self.channels[channel].volume / 2) > self.channels[channel].currentTweetCount) {
          hook.emit('sendMsg', {dest: channel, msg: data});
          self.channels[channel].currentTweetCount++;
        }
      }
    });
  };

  // Basic hook IRC events
  hook.on('*::idCheck', function (data) {
    self.idCheck = data.check ? true : false;
  });

  hook.on('*::Isaid', function (data) {
    if (data.to[0] === '#') {
      self.channels[data.to].messageCount++;
    }
  });

  hook.on('*::Ijoined', function (data) {
    self.joinChannel(data.channel);
  });

  // Give voice to employees.
  hook.on('*::userJoined', function (data) {
    var access = self.config.get('access');
    access.employee.forEach(function (name) {
      if (data.nick === name) {
        hook.emit('command', 'mode ' + data.channel + ' +v ' + data.nick);
        return;
      }
    });
  });

  hook.on('*::Iparted', function (data) {
    if (typeof self.channels[data] !== 'undefined') {
      self.channels[data].part();
      self.channels = self.channels.filter( function (item) {
        return item !== data;
      });
    }
  });

  hook.on('*::error::*', function (data) {
    console.error(data);
  });

};


exports.init = function (done) {

  //
  // Async steps.
  //

  done();

};
