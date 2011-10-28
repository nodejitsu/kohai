/*
 *
 * listeners/twitter.js - Event listeners for Hook.io-Twitter.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var twitter = module.exports = function () {
  var self = this;

  self.on('*::keptTweet', function (data) {
    self.sayTweet(data);
  });

  self.on('*::reported', function (data) {
    self.emit('sendMsg', {dest: data.to, msg: 'I have reported ' + data.name + ' as a spammer.'});
  });

  self.on('*::blocked', function (data) {
    self.emit('sendMsg', {dest: data.to, msg: 'I have blocked ' + data.name + '.'});
  });
};
