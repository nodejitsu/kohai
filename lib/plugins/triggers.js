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
  }
}



