/*
 *
 * support.js - send support emails from the IRC.
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
  this.mapCommands(this);
};

exports.commands = {
  
  "support" : function (data, callback) {

    var self = this,
        emailOptions,
        msg = command.slice(1).join(' '),
        source = ' [' + data.nick + ']';

    emailOptions = {
      to      : 'support@nodejitsu.com',
      from    : 'kohai@nodejitsu.com',
      subject : '[IRC]' + source,
      body    : new Date() + ' ' + msg
    };
    
    //
    // hook.io-mailer , email::send event
    //
    self.emit('email::send', emailOptions, function(){
      callback(null, {
        dest: data.to,
        msg: 'Support email sent successfully.  Someone will try to find you ASAP!'
      });
    });

  }

};

