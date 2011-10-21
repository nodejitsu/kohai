/*
 *
 * channel.js - an object to hold various channel data
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var Channel = exports.Channel = function (options) {
  for (var o in options) {
    this[o] = options[o];
  }
}

Channel.prototype.part = function () {
  this.active = false;
}

Channel.prototype.join = function () {
  this.active = true;
}

Channel.prototype.startVolume = function () {
  this._ircRate();
  this._twitRate();
}

Channel.prototype.stopVolume = function () {
  clearInterval(this.ircInterval);
  clearInterval(this.twitInterval);
}

Channel.prototype.config = function (key, value) {
  if (typeof value === 'undefined') {
    return this[key];
  }
  if (typeof key === 'string') {
    this[key] = value;
    return key + ' has been set to ' + value;
  }
  else {
    return false;
  }
}

Channel.prototype._ircRate = function () {
  var self = this,
      timespan = 60;
  self.rateValues = [];
  self.ircInterval = setInterval(function () {
    var sum = 0;
    if (self.rateValues.length > timespan) {
      self.rateValues.shift();
    }

    self.rateValues.push(self.messageCount);
    self.messageCount = 0;

    self.rateValues.forEach(function (value) {
      sum += Number(value);
    });
    self.rate = sum;
    self._volumetrics();
  }, 1000);

}

Channel.prototype._volumetrics = function () {
  var self = this;

  if (self.autoVolume) {
    if (self.rate > 10) {
      self.rate = 10;
    }
    if ((self.volume < 0) || (typeof self.volume === 'undefined')) {
      self.volume = 0;      
    }
    if ((10 - self.rate) <= self.volume) {
      self.volume = 10 - self.rate;
      self.lastVolume = self.volume;    
    }
    else if ((10 - self.rate) > self.volume) {
      self.lastVolume += self.lastVolume +0.05;
      self.volume = Math.round(self.lastVolume);
    }
  }
}

Channel.prototype._twitRate = function () {
  var self = this;

  self.twitInterval = setInterval(function () {
    if (self.currentTweetCount > 0) {
      self.currentTweetCount--;
    }
  }, self.twitPeriod * 1000);
}


