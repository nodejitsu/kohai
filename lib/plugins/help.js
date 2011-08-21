/* 
 *
 * help.js - kohai's interactive help system.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var help = module.exports = function (data, command) {
  if (command.length === 1) {
    this.emit('sendMsg', {
      dest: data.nick,
      msg: 'Hi! I\'m ' + this.ircNick + '.  For help topics, type `help list`.'
    });
  }
  else if (command[1] in info) {
    info[command[1]].call(this, data.nick);
  }
}

var info = {

  list: function (nick) {
    var msg = 'Available help topics: ' + Object.keys(info).join(' ');
    say.call(this, nick, msg);
  },

  password: function (nick) {
    var msg = 'To reset your password, type `jitsu users forgot [username]`. To change it, type `jitsu users changepassword`.';
    say.call(this, nick, msg);
  },

  handbook: function (nick) {
    var msg = 'The complete Nodejitsu handbook can be read at http://github.com/nodejitsu/handbook';
    say.call(this, nick, msg);
  },

  support: function (nick) {
    var msg = 'For additional support, try support@nodejitsu.com or hang out in #nodejitsu!';
    say.call(this, nick, msg);
  }

};


function say(dest, msg) {
  this.emit('sendMsg', { dest: dest, msg: msg });
}