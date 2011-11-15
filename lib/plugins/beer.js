/*
 *
 * plugins/beer.js - IRC commands for beer listener
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
  
  'beer': function (data, command) {
    
    var self = this;

    var re = /^[\+\-]?(\w+)([:, ]){0,3}(\+\+|--)/,
        res;

    if (res = re.exec(data.msg)) {
      if (res[1] === data.nick) {
        return callback(null, {
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

      return callback(null, {
        dest: data.to,
        msg: res[1] + ' has ' + self.karma[res[1]] + ' ' +
             (self.preferences[res[1]] || 'beer') +
             ((Math.abs(self.karma[res[1]]) > 1) ? 's' : '')
      });
    }
  },
  
  'like' = function (data, command) {
    if (!command[1]) {
      return;
    }

    var drink = command.splice(1).join(' ');


    self.preferences[data.nick] = drink;
    self.config.set('karma:preferences', self.preferences);
    self.config.save();

    callback(null, {
      dest: data.to,
      msg: data.nick + ' likes ' + drink + '.'
    });
  }

};

