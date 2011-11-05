/*
 *
 * triggers.js - The commands available to IRC users.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */
 
var fs = require('fs');

var triggers = module.exports = {

  'version' : function (data, command) {
    if (!data[this.ranks[2]]) { return false; }
    this.emit('sendMsg', { 
      dest: data.to, 
      msg: 'Kohai ' + this.config.get('version') 
        + ' running on Node.JS ' 
        + process.version
    });
  },


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
}



