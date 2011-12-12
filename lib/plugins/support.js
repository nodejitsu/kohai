/*
 *
 * support.js - send support emails from the IRC.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var support = module.exports = function (data, command) {
  var self = this,
      emailOptions,
      msg = command.slice(1).join(' '),
      source = ' [' + data.nick + ']';

  emailOptions = {
    to      : 'admin@ilovedarkfall.com',
    from    : 'kohai@ilovedarkfall.com',
    subject : '[IRC]' + source,
    body    : new Date() + ' ' + msg
  };

  self.emit('sendEmail', emailOptions);
  
  self.once('*::emailSent', function (result) {
    self.emit('sendMsg', {
      dest: data.to,
      msg: 'Support email sent successfully.  Someone will try to find you ASAP!'
    });
  });
};
