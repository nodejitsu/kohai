/*
 *
 * irc/index.js - broadway plugin for basic irc management in kohai.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var Channel = exports.Channel = require('./channel').Channel,
    path = require('path'),
    utile = require('utile'),
    Router = require('../../router').Router;

exports.name = 'kohai-irc';

exports.attach = function (options) {
  var self = this,
      hook;

  self.options = options || {};
  self.irc = new Router();
  self.irc.trigger = '\\+!';

  if (!self.hook) {
    throw new Error('This plugin depends on flatiron-hook.');
  }
  else {
    hook = self.hook;
  }

  // Initialization to occur on hook::ready
  hook.on('hook::ready', function () {
  });

  // Route text commands through our custom router
  hook.on('irc::msg', function (data) {
    self.irc.dispatch('on', data, self, function (err) {
      if (err) {
        self.log.warn(err.message);
      }
    });
  });

  self.irc.on('parrot :word', function (word) {
    self.hook.emit('irc::msg', {
      to: this.data.to,
      msg: word || 'word'
    });
  });

  /*
  // Handle the bot joining a channel.
  hook.on('*::Ijoined', function (data) {
    self.joinChannel(data.channel);
  });

  // Handler for channel joining.
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

  // Handle the bot leaving a channel.
  hook.on('*::Iparted', function (data) {
    if (typeof self.channels[data] !== 'undefined') {
      self.channels[data].part();
      self.channels = self.channels.filter(function (item) {
        return item !== data;
      });
    }
  });

  // Some sort of idCheck event.
  // This is particular to freenode.
  if (self.config.get('idCheck')) {
    hook.on('*::idCheck', function (data) {
      self.idCheck = data.check ? true : false;
    });
  }

  // Count Kohai's messages for the purposes of logging message rates.
  // TODO: Move to twitter plugin
  hook.on('*::Isaid', function (data) {
    if (data.to[0] === '#') {
      self.channels[data.to].messageCount++;
    }
  });

  // Handle received messages here.
  // This should get some nice routing action.
  hook.on('*::gotMessage', function (data) {

    // check auth if message is a PM to Kohai.
    if (data.to === self.nick) {
      return self.checkAuth(data);
    }

    // Otherwise, use the gotMessage handler.
    return self.gotMessage(data);
  });

  // Log irc errors
  hook.on('*::error::*', function (data) {
    // Do whatever with errors that needs to be done.
    // We should see these messages on the hook.io firehose so we don't need to
    // do that.
  });
  */

};
