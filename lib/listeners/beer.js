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

  self.karma = {};

  self.on('*::gotMessage', function (data) {
    var re = /(\w+)(\+\+|--)/,
        res;

    if (res = re.exec(data.text)) {
      self.karma[res[1]] || (self.karma[res[1]] = 0);
      if (res[2] == '++') {
        ++self.karma[res[1]];
      }
      else if (res[2] == '--') {
        --self.karma[res[1]];
      }
      return self.emit('sendMsg', {
        dest: data.to,
        msg: res[1] + ' has ' + self.karma[res[1]] + ' beer' +
             ((Math.abs(self.karma[res[1]]) > 1) ? 's' : '')
      });
    }
  });
};

