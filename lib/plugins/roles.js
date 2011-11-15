/*
 *
 * roles.js - simple roles manager for users based on unique username
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
  
  "roles" : function (data, callback) {

    console.log('check auth');

    var self = this,
        access = self.config.get('access'),
        inherit = false;
    self.ranks.forEach(function (rank) {
      // No message should have any rank fields prior to this function.
      if (typeof data[rank] !== 'undefined') {
        return false;
      }
    });
    self.ranks.forEach(function (level) { 
      if (inherit) { 
        data[level] = true;
        return;
      }
      access[level].forEach(function (name) {
        if (name === data.nick) {
          data[level] = true;
          inherit = true;
        }
      });
    });
    if (data.to === self.nick) { 
      return self._dispatchPM(data);
    }
    return self._dispatcher(data);
    }


  }

};

