var util = require('utile');
    Channel = require('./irc/channel').Channel;

exports.name = 'irc-channels';

exports.attach = function () {

  var self = this,
      irc = this.irc,
      channels = {};

  irc.on('self::joined', join);
  irc.on('self::parted', part);

  this.channels = {
    join: join,
    part: part,
    synchronize: synchronize
  };

  function join(data) {
    if (!channels[data.channel]) {
      channels[data.channel] = new Channel(data);
    }
    channels[data.channel].join();
  }

  function part(data) {
    channels[data.channel].part();
  }

  function synchronize(cb) {
    irc.channels(function (err, reply) {
      if (err) {
        return cb(err);
      }

      var chans = reply.channels;

      Object.keys(chans).forEach(function (chan) {
        chans[chan].channel = chan;
        join(chans[chan]);
      });
      cb();
    });
  };

  this.hook.on('**::irc::connected', function (data) {
    if (data.type == 'irc') {
      self.channels.synchronize(function (err) {
        if (err) {
          self.emit('error', err);
        }
      });
    }
  });

};

exports.init = function (done) {
  var self = this,
      hook = this.hook;

  hook.on('hook::ready', function () {
    self.channels.synchronize(done);
  });
};
