exports.name = 'kohai-base';

var hook = require('./hook'),
    irc = require('./irc-hook'),
    channels = require('./channels');

exports.attach = function (opts) {
  this.use(hook, {});
  this.use(irc, {});
  this.use(channels, {});
}
