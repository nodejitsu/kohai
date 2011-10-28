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



