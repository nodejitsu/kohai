/* 
 *
 * support.js - send support emails from the IRC.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var support = module.exports = function (data, command) {
  var self = this,
      msg = command.slice(1).join(' '),
      source = ' [' + data.nick + ']';

  var emailOptions = {
    to      : 'support@nodejitsu.com',
    from    : 'kohai@nodejitsu.com',
    subject : '[IRC]' + source,
    body    : new Date + ' ' + msg
  };

  console.dir(emailOptions);

  self.emit('sendEmail', emailOptions);
  
  self.on('*::emailSent', function (data) {
    self.emit('sendMsg', {
      dest: data.to,
      msg: 'Support email sent successfully.  Someone will try to find you ASAP!'
    });
  });
}