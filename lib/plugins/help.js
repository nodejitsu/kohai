/* 
 *
 * help.js - kohai's interactive help system.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var help = module.exports = function (data, command) {
  var helpInfo = this.config.get('help');
  if (command.length === 1) {
    this.emit('sendMsg', {
      dest: data.nick,
      msg: 'Hi! I\'m ' + this.ircNick + '.  For help topics, type `help list`.'
    });
  }
  else if (command[1] in helpInfo) {
    say.call(this, data.nick, helpInfo[command[1]]);
  }
  else if (command[1] === 'list') {
    say.call(this, data.nick, 'Available help topics: ' + Object.keys(helpInfo).join(' '));
  }
}

function say(dest, msg) {
  this.emit('sendMsg', { dest: dest, msg: msg });
}