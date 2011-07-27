/*
 *
 * triggers.js - The commands available to IRC users.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var triggers = module.exports = {
  // Any trigger with 'console.log(arguments)' at the top is unfinished.

  'tweet' : function (data, command) {
    if (!data.friend) { return false; }
    this.emit('i.tweet.o.tweet', command.slice(1).join(' '));
  },

  'version' : function (data, command) {
    if (!data.friend) { return false; }
    this.emit('i.sendMsg.o.sendMsg', {dest: data.to, msg: this.get('version')});
  },

  'join' : function (data, command) {
    if (!data.admin) {return false;}
    this.emit('i.join.o.join', command[1]);
  },

  'part' : function (data, command) {
    if (!data.admin) {return false;}
    var channel = command[1] ? command[1] : data.to;
    this.emit('i.part.o.part', channel);
  },

  'report' : function (data, command) {
    if (!data.ninja) {return false;}
    console.log(arguments);
    this.emit('i.report.o.report', {name: command[1], to: data.to});
  },

  'block' : function (data, command) {
    if (!data.ninja) {return false;}
    console.log(arguments);
    this.emit('i.block.o.block', {name: command[1], to: data.to});
  },

  'save' : function (data, command) {
    if (!data.admin) {return false;}
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
    if (!data.friend) {return false;}
    // data.nick
    var n = Math.floor(Math.random() * this.insults.length);
    this.emit('i.sendMsg.o.sendMsg', { dest: data.to, msg: insults[n].replace('%%', command[1]) }) 
  },

  'kick' : function (data, command) {
    if (!data.admin) {return false;}
    var dest = command[2] ? command[2] : data.to;
    console.log(command[1], ' has been kicked from ', dest);
    this.emit('i.sendMsg.o.sendMsg', { dest: dest, msg: 'kohai says GTFO!' });
    this.emit('i.command.o.command', 'kick ' + dest + ' ' + command[1]);
  },

  'ban' : function (data, command) {
    if (!data.admin) {return false;}
    var dest = command[2] ? command[2] : data.to;
    console.log(arguments);
    console.log(command[1], ' has been banned from ', dest, ' at the request of ', data.nick);
    this.emit('i.sendMsg.o.sendMsg', { dest: dest, msg: 'BEHOLD THE MIGHT OF THE BANHAMMER!!!' });
    this.emit('i.command.o.command', 'mode ' + dest + ' +b ' + command[1]);
    this.emit('i.command.o.command', 'kick ' + dest + ' ' + command[1]);

  },

  'unban' : function (data, command) {
    if (!data.admin) {return false;}
    var dest = command[2] ? command[2] : data.to;
    console.log(arguments);
    console.log(command[1], ' has been unbanned from ', dest, ' at the request of ', data.nick);
    this.emit('i.sendMsg.o.sendMsg', { dest: dest, msg: 'Mercy has been bestowed upon ' + data.nick });
    this.emit('i.command.o.command', 'mode ' + dest + ' -b ' + command[1]);
  },

  'stfu' : function (data, command) {
    if (!data.ninja) {return false;}
    var self = this,
        dest = command[2] ? command[2] : data.to;
    console.log(arguments);
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
  },

  'config' : function (name, operation, key, val) {
    // Permissions already checked, so no need here.
    // Thanks again to samsonjs for the config code.
    
    var self = this;
    
    // get key
    if (operation === 'get') {
      if (!key) { 
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Get what?'}); 
      }
      else if (!key.match(/^auth.*/)) {
        var repr;
        val = self.get(key);
        if (val && typeof val.join === 'function') {
          repr = '[' + val.join(', ') + ']'
        }
        else {
          repr = JSON.stringify(val)
        }
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: key + ' is ' + repr});
      }
      else { 
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Retrieval of authorization info not permitted.'}); 
      }
    }

    // set key json
    else if (operation === 'set') {
      try {
        self.set(key, JSON.parse(val))
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: key + ' has been set to: ' + val + '.'});
      }
      catch (e) {
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Sorry, invalid JSON'});
      }
    }

    // add list-key value
    else if (operation === 'add') {
      var a = self.get(key);
      if (!(a && typeof a.push === 'function')) {
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Sorry, cannot add to ' + key});
      }
      else if (a.indexOf(val) !== -1) {
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: val + ' is already in ' + key});
      }
      else {
        a.push(val)
        self.set(key, a)
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: val + ' was added to ' + key + '.'});
      }
    }

    // rm list-key value
    else if (operation === 'rm') {
      var a = self.get(key)
      if (!(a && typeof a.filter === 'function')) {
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Sorry, cannot remove from ' + key});
        return
      }
      var b = a.filter(function(x) { return x !== val })
      if (b.length < a.length) {
        self.set(key, b)
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: val + ' was removed from ' + key + '.'});
      }
      else {
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: val + ' was not found in ' + key + '.'});
      }
    }

    // save
    else if (operation === 'save') {
      self.save(function (err) {
        if (err) {
          self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: err});
        }
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Config saved.'})
      });
    }

    else {
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Sorry, ' + name + ', invalid operation for config.'});
    }
  }
}

