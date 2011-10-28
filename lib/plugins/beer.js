/*
 *
 * plugins/beer.js - IRC commands for beer listener
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var beer = exports;

beer.like = function (data, command) {
  if (!command[1]) {
    return;
  }

  var drink = command.splice(1).join(' ');

  this.emit('karmaPreferenceSet', {
    nick: data.nick,
    preference: drink
  });

  this.emit('sendMsg', {
    dest: data.to,
    msg: data.nick + ' likes ' + drink + '.'
  });
};

