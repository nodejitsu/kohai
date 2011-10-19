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
  var user    = /([\w\.-]+)/,
      project = /([\w\.-]+)\/([\w\.-]+)/,
      issue   = /([\w\.-]+)\/([\w\.-]+)#(\d+)/,
      SHA     = /([\w\.-]+)\/([\w\.-]+)@([a-fA-F0-9]+)/,
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

