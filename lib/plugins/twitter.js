/*
 *
 * plugins/twitter.js - IRC commands for Twitter interaction.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

exports.attach = function () {

};

exports.init = function () {

//
// Map commands to hook.io events
//

};

exports.commands = {

};

return; 
module['exports'] = function (kohai) {

  //
  // Listen for kohai events to send to twitter
  //
  kohai.on('**::kohai::tweet', function(data){
    kohai.emit('twitter::tweet', data);
    console.log('tweet');
  });

  kohai.on('**::kohai::stoptweets', function(data){
    kohai.emit('twitter::stoptweets', data);
  });

  kohai.on('**::kohai::starttweets', function(data){
    kohai.emit('twitter::starttweets', data);
  });

  //
  // Listen for events from Twitter
  //
  kohai.on('**::twitter::keptTweet', function (data) {
    kohai.emit('kohai::out', data);
  });

  kohai.on('**::twitter::reported', function (data) {
    kohai.emit('kohai::out', {dest: data.to, msg: 'I have reported ' + data.name + ' as a spammer.'});
  });

  kohai.on('**::twitter::blocked', function (data) {
    kohai.emit('kohai::out', {dest: data.to, msg: 'I have blocked ' + data.name + '.'});
  });

};

return;

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



/*

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

*/

