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
    this.emit('i.tweet.o.tweet', command.slice(1).join(' '));
  },

  'version' : function (data, command) {
    if (!data.friend) { return false; }
    this.emit('i.sendMsg.o.sendMsg', {dest: data.to, msg: this.get('version')});
  },

  'join' : function (data, command) {
    if (!data.admin) { return false; }
    this.emit('i.join.o.join', command[1]);
  },

  'part' : function (data, command) {
    if (!data.admin) { return false; }
    var channel = command[1] || data.to;
    this.emit('i.part.o.part', channel);
  },

  'report' : function (data, command) {
    if (!data.ninja) { return false; }
    this.emit('i.report.o.report', {name: command[1], to: data.to});
  },

  'block' : function (data, command) {
    if (!data.ninja) { return false; }
    this.emit('i.block.o.block', {name: command[1], to: data.to});
  },

  'save' : function (data, command) {
    if (!data.admin) { return false; }
    var self = this;
    self.save(function (err) {
      if (err) { return self.log(err); }
      console.log('Configuration saved at the behest of %s', data.nick);
    });
  },

  'help' : function (data, command) {
    console.log(arguments);
  },

  'insult' : function (data, command) {
    if (!data.friend) { return false; }
    // data.nick
    var n = Math.floor(Math.random() * this.insults.length);
    this.emit('i.sendMsg.o.sendMsg', { dest: data.to, msg: insults[n].replace('%%', command[1]) }) 
  },

  'kick' : function (data, command) {
    if (!data.admin) { return false; }
    var dest = command[2] || data.to;
    console.log(command[1], ' has been kicked from ', dest);
    this.emit('i.sendMsg.o.sendMsg', { dest: dest, msg: 'kohai says GTFO!' });
    this.emit('i.command.o.command', 'kick ' + dest + ' ' + command[1]);
  },

  'ban' : function (data, command) {
    if (!data.admin) { return false; }
    var dest = command[2] || data.to;
    console.log(command[1], ' has been banned from ', dest, ' at the request of ', data.nick);
    this.emit('i.sendMsg.o.sendMsg', { dest: dest, msg: 'BEHOLD THE MIGHT OF THE BANHAMMER!!!' });
    this.emit('i.command.o.command', 'mode ' + dest + ' +b ' + command[1]);
    this.emit('i.command.o.command', 'kick ' + dest + ' ' + command[1]);

  },

  'unban' : function (data, command) {
    if (!data.admin) { return false; }
    var dest = command[2] || data.to;
    console.log(command[1], ' has been unbanned from ', dest, ' at the request of ', data.nick);
    this.emit('i.sendMsg.o.sendMsg', { dest: dest, msg: 'Mercy has been bestowed upon ' + data.nick });
    this.emit('i.command.o.command', 'mode ' + dest + ' -b ' + command[1]);
  },

  'stfu' : function (data, command) {
    if (!data.ninja) { return false; }
    var self = this,
        dest = command[2] || data.to;
    self.emit('i.sendMsg.o.sendMsg', { dest: dest, msg: 'Gross Adjusted Noobosity of ' + command[1] 
      + ' has exceeded specified telemetry parameters.  Irrevocable 60 second mute has been initiated.'});
    self.emit('i.command.o.command', 'mode ' + dest + ' +q ' + command[1]);
    setTimeout(function () {
      self.emit('i.command.o.command', 'mode ' + dest + ' -q ' + command[1]);
      self.emit('i.sendMsg.o.sendMsg', { 
        dest: dest, 
        msg: 'Noobosity telemetry data now below thresholds.  Removing mute for ' + command[1] + '.'
      });
    }, 60000);
  },

  'gtfo': function (data, command) {
    if (!data.admin) { return false; }
    this.emit('i.exit.o.exit', null);
  }
}



fs.readdirSync(__dirname + '/plugins').forEach(function (plugin) {
  if (/^.*\.js$/.test(plugin)) {
    plugin = plugin.replace('.js', '');
    if (!(plugin in triggers)) {
      triggers.__defineGetter__(plugin, function () {
        return require(__dirname + '/plugins/' + plugin);
      });
    }
    else {
      console.log('Trigger not loaded: %s', plugin);
    }
  }
});



