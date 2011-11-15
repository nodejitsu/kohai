/*
 *
 * help.js - kohai's interactive help system.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */
 
 
 
exports.attach = function () {

};

exports.init = function () {

 //
 // Map commands to hook.io events
 //

};

var helpInfo = this.config.get('help');

exports.commands = {

  "help" : function(data, callback){

    if (!data.command) {
      return callback(null, {
        dest: data.nick,
        msg: 'Hi! I\'m ' + this.nick + '.  For help topics, type `help list`.'
      });
    }

    if (!helpInfo[data.command[1]]) {
      return callback(null, {
        dest: data.nick,
        msg: 'Available help topics: ' + Object.keys(helpInfo).join(' ')
      });
    }

    callback(null, {
      dest: data.nick,
      msg: helpInfo[data.command[1]]
    });

  }
};



