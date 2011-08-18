/*
 *
 * triggers.js - The commands available to IRC users.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */
var fs = require('fs');

var triggers = module.exports = {

  'tweet' : function (data, command) {
    if (!data.friend) { return false; }
    var text = command.slice(1).join(' ');
    if (text.length > 140) {
      this.emit('sendMsg', { 
        dest: data.to, 
        msg: 'Sorry ' + data.nick + ', that tweet message exceeds 140 characters (' + text.length + ').' 
      });
    }
    this.emit('tweet', text);
  },

  'stoptweets' : function (data, command) {
    if (!data.employee) {return false; }
    this.emit('stopTweets', null);
  },

  'starttweets' : function (data, command) {
    if (!data.employee) { return false; }
    this.emit('startTweets', null);
  },

  'version' : function (data, command) {
    if (!data.friend) { return false; }
    this.emit('sendMsg', {dest: data.to, msg: this.config.get('version')});
  },

  'join' : function (data, command) {
    if (!data.admin) { return false; }
    this.emit('join', command[1]);
  },

  'part' : function (data, command) {
    if (!data.admin) { return false; }
    var channel = command[1] || data.to;
    this.emit('part', channel);
  },

  'report' : function (data, command) {
    if (!data.employee) { return false; }
    this.emit('report', {name: command[1], to: data.to});
  },

  'block' : function (data, command) {
    if (!data.employee) { return false; }
    this.emit('block', {name: command[1], to: data.to});
  },

  'insult' : function (data, command) {
    if (!data.friend) { return false; }
    var n = Math.floor(Math.random() * this.insults.length),
        target = command.slice(1).join(' ').replace(/[^\w\d\s]/g, '');
    this.emit('sendMsg', { dest: data.to, msg: this.insults[n].replace('%%', target) }) 
  },

  'voice' : function (data, command) {
    if (!data.admin) { return false }
    var dest = command[2] || data.to;
    this.emit('sendMsg', { dest: dest, msg: 'I declare you cool, ' + command[1] + '!' });
    this.emit('command', 'mode ' + dest + ' +v ' + command[1]);
  },

  'devoice' : function (data, command) {
    if (!data.admin) { return false }
    var dest = command[2] || data.to;
    this.emit('sendMsg', { dest: dest, msg: 'No more voice for you, ' + command[1] + '!' });
    this.emit('command', 'mode ' + dest + ' -v ' + command[1]);
  },

  'op' : function (data, command) {
    if (!data.admin) { return false }
    var dest = command[2] || data.to;
    this.emit('command', 'mode ' + dest + ' +o ' + command[1]);
  },

  'deop' : function (data, command) {
    if (!data.admin) { return false }
    var dest = command[2] || data.to;
    this.emit('command', 'mode ' + dest + ' -o ' + command[1]);
  },

  'kick' : function (data, command) {
    if (!data.employee) { return false; }
    var dest = command[2] || data.to;
    console.log(command[1], ' has been kicked from ', dest);
    this.emit('sendMsg', { dest: dest, msg: 'kohai says GTFO!' });
    this.emit('command', 'kick ' + dest + ' ' + command[1]);
  },

  'ban' : function (data, command) {
    if (!data.admin) { return false; }
    var dest = command[2] || data.to;
    console.log(command[1], ' has been banned from ', dest, ' at the request of ', data.nick);
    this.emit('sendMsg', { dest: dest, msg: 'BEHOLD THE MIGHT OF THE BANHAMMER!!!' });
    this.emit('command', 'mode ' + dest + ' +b ' + command[1]);
    this.emit('command', 'kick ' + dest + ' ' + command[1]);
  },

  'unban' : function (data, command) {
    if (!data.admin) { return false; }
    var dest = command[2] || data.to;
    console.log(command[1], ' has been unbanned from ', dest, ' at the request of ', data.nick);
    this.emit('sendMsg', { dest: dest, msg: 'Mercy has been bestowed upon ' + data.nick });
    this.emit('command', 'mode ' + dest + ' -b ' + command[1]);
  },

  'stfu' : function (data, command) {
    if (!data.employee) { return false; }
    var self = this,
        dest = command[2] || data.to;
    self.emit('sendMsg', { dest: dest, msg: 'Gross Adjusted Noobosity of ' + command[1] 
      + ' has exceeded specified telemetry parameters.  Irrevocable 60 second mute has been initiated.'});
    self.emit('command', 'mode ' + dest + ' +q ' + command[1]);
    setTimeout(function () {
      self.emit('command', 'mode ' + dest + ' -q ' + command[1]);
      self.emit('sendMsg', { 
        dest: dest, 
        msg: 'Noobosity telemetry data now below thresholds.  Removing mute for ' + command[1] + '.'
      });
    }, 60000);
  },

  'gtfo': function (data, command) {
    if (!data.admin) { return false; }
    this.emit('hook::exit', null);
  }
}



fs.readdirSync(__dirname + '/plugins').forEach(function (plugin) {
  if (/^.*\.js$/.test(plugin)) {
    plugin = plugin.replace('.js', '');
    if (!(plugin in triggers)) {
      try {
        triggers.__defineGetter__(plugin, function () {
          return require(__dirname + '/plugins/' + plugin);
        });
      }
      catch (err) {
        console.log('Plugin \'%s\' was not loaded due to error: %s', plugin, err.message);
      }
    }
    else {
      console.log('Duplicate trigger not loaded: %s', plugin);
    }
  }
});



