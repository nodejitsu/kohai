exports.name = 'irc-hooks';

var util = require('utile');

// Core irc management
var IRC = exports.IRC = function (hook) {
  this.hook = hook;

  // TODO: Add hook event listeners
};

IRC.prototype.channels = function (cb) {
  this.hook.emit('irc::channels', cb);
};

// broadway attachments
exports.attach = function (options) {
  this.irc = new IRC(this.hook);
};

exports.init = function (done) {
  done();
};
