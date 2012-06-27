exports.name = 'irc-hooks';

var util = require('utile'),
    EventEmitter2 = require('eventemitter2').EventEmitter2;

// Core irc management functionality. Basically unpacks the api.
var IRC = exports.IRC = function (hook) {
  EventEmitter2.call(this, {
    wildcard: true,
    delimiter: '::'
  });

  this.hook = hook;

  this.hook.on('**::irc::joined', function (data) {
    if (data.nick) {
      this.emit('joined', data);
    }
    else {
      this.emit('self::joined', data);
    }
  });

  this.hook.on('**::irc::parted', function (data) {
    if (data.nick) {
      this.emit('parted', data);
    }
    else {
      this.emit('self::parted', data);
    }
  });
};
util.inherits(IRC, EventEmitter2);

IRC.prototype.join = function (channel) {
  this.hook.emit('irc::join', channel);
};

IRC.prototype.part = function (channel) {
  this.hook.emit('irc::part', channel);
};

IRC.prototype.say = function (to, msg) {
  this.hook.emit('irc::say', {
    to: to,
    msg: msg
  });
};

IRC.prototype.channels = function (cb) {
  try {
    this.hook.emit('irc::channels', {}, function (channels) {
      cb(null, channels);
    });
  }
  catch (err) {
    cb(err);
  }
};

// broadway attachments
exports.attach = function (options) {
  this.irc = new IRC(this.hook);
};

exports.init = function (done) {
  done();
};
