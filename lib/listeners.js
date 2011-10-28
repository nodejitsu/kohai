

var fs = require('fs');

var listeners = exports;

listeners.init = function () {
  var self = this;

  self.on('*::idCheck', function (data) {
    self.idCheck = data.check ? true : false;
  });
  
  self.on('*::gotMessage', function (data) {
    if (data.to === self.nick) {
      return self.checkAuth(data);
    }
    return self.gotMessage(data);
  });

  self.on('*::Isaid', function (data) {
    if (data.to[0] === '#') {
      self.channels[data.to].messageCount++;
    }
  });

  self.on('*::Ijoined', function (data) {
    self.joinChannel(data.channel);
  });

  self.on('*::userJoined', function (data) {
    var access = self.config.get('access');
    access.employee.forEach(function (name) {
      if (data.nick === name) {
        self.emit('command', 'mode ' + data.channel + ' +v ' + data.nick);
        return;
      }
    });
  });

  self.on('*::Iparted', function (data) {
    if (typeof self.channels[data] !== 'undefined') {
      self.channels[data].part();
      self.channels = self.channels.filter( function (item) {
        return item !== data;
      });
    }
  });

  self.on('*::error::*', function (data) {
    console.log(data);
  });

  _lazyLoad.call(self);
}

function _lazyLoad() {
  var self = this;
  fs.readdirSync(__dirname + '/listeners').forEach(function (listener) {
    var mod;
    if (/^.*\.js$/.test(listener)) {
      listener = listener.replace('.js', '');
      try {
        var mod = require(__dirname + '/listeners/' + listener);
        switch(typeof mod) {
          case 'function':
            mod.call(self);
            break;
          case 'object':
            Object.getOwnPropertyNames(mod).forEach(function (item) {
              if (typeof mod[item] === 'function') {
                mod[item].call(self);
              }
              else {
                console.log('Cannot load non-function as event listener: %s.%s', listener, item);
              }
            });
            break;
          default:
            console.log('Cannot load non-functions as event listeners.');
            break;
        }
      }
      catch (err) {
        console.log('Listener plugin \'%s\' was not loaded due to error: %s', listener, err.message);
      }
    }
  });
}
