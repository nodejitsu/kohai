/*
 *
 * listeners/beer.js - Event listener for IRC events, providing you with cold
 * beer
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var beer = module.exports = function () {
  var self = this;

  self.karma = self.config.get('karma:values') || {};
  self.preferences = self.config.get('karma:preferences') || {};

  self.on('*::gotMessage', function (data) {
    var re = /^[\+\-]?(`\w+)([:, ]){0,3}(\+\+|--)/,
        res;

    if (res = re.exec(data.text)) {
      if (res[1] === data.nick) {
        return self.emit('sendMsg', {
          dest: data.to,
          msg: "You can't give karma to yourself!"
        });
      }
      self.karma[res[1]] || (self.karma[res[1]] = 0);
      if (res[3] === '++') {
        ++self.karma[res[1]];
      }
      else if (res[3] === '--') {
        --self.karma[res[1]];
      }

      self.config.set('karma:values', self.karma);
      self.config.save();

      return self.emit('sendMsg', {
        dest: data.to,
        msg: res[1] + ' has ' + self.karma[res[1]] + ' ' +
             (self.preferences[res[1]] || 'beer') +
             ((Math.abs(self.karma[res[1]]) > 1) ? 's' : '')
      });
    }
  });

  self.on('karmaPreferenceSet', function (data) {
    self.preferences[data.nick] = data.preference;
    self.config.set('karma:preferences', self.preferences);
    self.config.save();
  });
};

