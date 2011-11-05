/*
 *
 * plugins/twitter.js - IRC commands for Twitter interaction.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var twitter = exports;

twitter.tweet = function (data, command) {
  if (!data[this.ranks[2]]) {
    return false;
  }
  var text = command.slice(1).join(' ');
  if (text.length > 140) {
    this.emit('sendMsg', {
      dest: data.to,
      msg: 'Sorry ' + data.nick + ', that tweet message exceeds 140 characters (' + text.length + ').'
    });
  }
  this.emit('tweet', text);
};

twitter.stoptweets = function (data, command) {
  if (!data[this.ranks[1]]) {
    return false;
  }
  this.emit('stopTweets', null);
};

twitter.starttweets = function (data, command) {
  if (!data[this.ranks[1]]) {
    return false;
  }
  this.emit('startTweets', null);
};

twitter.report = function (data, command) {
  if (!data[this.ranks[1]]) {
    return false;
  }
  this.emit('report', {name: command[1], to: data.to});
};

twitter.block = function (data, command) {
  if (!data[this.ranks[1]]) {
    return false;
  }
  this.emit('block', {name: command[1], to: data.to});
};





Kohai.prototype.sayTweet = function (data) {
  var self = this;
  Object.getOwnPropertyNames(self.channels).forEach(function (channel) {
    if (self.channels[channel].wantsTweets === 'true') {
      if ((self.channels[channel].volume / 2) > self.channels[channel].currentTweetCount) {
        self.emit('sendMsg', {dest: channel, msg: data});
        self.channels[channel].currentTweetCount++;
      }
    }
  });
}


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
