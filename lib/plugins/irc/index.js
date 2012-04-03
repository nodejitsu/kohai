/*
 *
 * irc/index.js - broadway plugin for basic irc management in kohai.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var Channel = exports.Channel = require('./channel').Channel,
    path = require('path'),
    utile = require('utile');

exports.name = 'kohai-irc';

exports.attach = function (options) {
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

    // We'll need a new irc hook. I hear hook.io can spawn them.
    hook.spawn([
      {
        type: 'irc',
        name: 'kohai-irc'
      }
    ]);

    // This is a trick for something important. TODO: ask avianFlu what this
    // means again.
    // if ((process.getuid() === 0) && self.uid) {
    //   process.setuid(self.uid);
    // }

    // Join channels.
    //self.config.get('channels').forEach(function (channel) {
    //  //self.log.info('joining channel %s', channel);
    //  self.joinChannel(channel);
    //});

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
