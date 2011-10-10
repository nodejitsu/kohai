/* 
 *
 * plugins/gh.js - IRC commands for GitHub interaction.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var gh = exports;

gh.gh = function (data, command) {
  if (!command[1]) {
    return;
  }
  var user    = /([a-zA-Z0-9_-]+)/,
      project = /([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/,
      issue   = /([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)#([0-9]+)/,
      SHA     = /([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)@([a-fA-F0-9]+)/,
      result;

  if (result = issue.exec(command[1])) {
    return this.emit('sendMsg', {
      dest: data.to,
      msg: data.nick + ', https://github.com/' + result[1] + '/' + result[2] +
         '/issues/' + result[3]
    });
  }

  if (result = SHA.exec(command[1])) {
    return this.emit('sendMsg', {
      dest: data.to,
      msg: data.nick + ', https://github.com/' + result[1] + '/' + result[2] +
         '/commit/' + result[3]
    });
  }

  if (result = project.exec(command[1])) {
    return this.emit('sendMsg', {
      dest: data.to,
      msg: data.nick + ', https://github.com/' + result[1] + '/' + result[2]
    });
  }

  if (result = user.exec(command[1])) {
    return this.emit('sendMsg', {
      dest: data.to,
      msg: data.nick + ', https://github.com/' + result[1]
    });
  }
}

