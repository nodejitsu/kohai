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

  this.emit('karmaPreferenceSet', {
    nick: data.nick,
    preference: command.splice(1).join(' ')
  });
};

