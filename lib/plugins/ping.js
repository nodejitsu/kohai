// plugin for getting realtime health

var async = require('async'),
    http = require('http'),
    url = require('url');

var Ping = function Ping() {
};

Ping.prototype.start = function(client, config) {
  if (!config.plugins.ping || !config.plugins.ping.urls) {
    console.log('config.plgins.ping.urls should be defined');
    return;
  }

  var that = this;

  this.client = client;
  this.channel = '';
  this.urls = config.plugins.ping.urls;
  this.failMessage = config.plugins.ping.failMessage ||
                     'Oops! Bad news here, guys!';

  client.once('join', function(channel, nick) {
    that.channel = channel;

    that.tick();
    that.interval = setInterval(that.tick.bind(that),
                                config.plugins.ping.interval || 60000);

  });
};

Ping.prototype.tick = function() {
  var that = this,
      client = this.client,
      channel = this.channel;

  async.map(this.urls, function(uri, callback) {
    http.get(url.parse(uri), function(res) {
      if (res.statusCode < 200 || res.statusCode >= 400) {
        return err();
      }
    }).on('error', function() {
      err();
    });

    function err() {
      callback(uri + ' fails to load!');
    };
  }, function(err) {
    if (err) {
      client.say(channel,
                 that.failMessage + ' ' +
                 (Array.isArray(err) ?
                     err.join(' ')
                     :
                     err)
                );
    }
  });
};

Ping.prototype.destroy = function() {
  clearInterval(this.interval);
};

module.exports = new Ping();
