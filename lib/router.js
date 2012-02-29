/*
 *
 * router.js - This should contain a director router or similar for handling
 * "triggers."
 *
 * (c) 2012 Nodejitsu Inc.
 *
 */

/*

  //
  // This is the original handler for messages.
  //
  hook.on('*::gotMessage', function (data) {

    // check auth if message is a PM to Kohai.
    if (data.to === self.nick) {
      return self.checkAuth(data);
    }

    // Otherwise, use the gotMessage handler.
    return self.gotMessage(data);
  });

  self.gotMessage = function gotMessage(data) {

    // What is an idCheck?
    var idCheck = self.idCheck ? '\\+' : '',
        trigger = new RegExp('^' 
          + idCheck 
          + this.channels[data.to].commandString // What is this?
          + '\\w+\\s?\\w*.*');

    // Count messages for the purposes of twitter
    self.channels[data.to].messageCount++;

    // This appears to be doing some basic routing.
    if (trigger.test(data.text)) {
      self.checkAuth(data);
    } // Triggers requests for help and support. TODO: Refactor out.
    else if (/^-!?(help|support)/.test(data.text)) {
      var command = data.text.replace(/-!/, '').split(' ');
      triggers[command[0]].call(this, data, command);
    }
    else {
      self.checkComment(data);
    }
  };

  // Dispatches to triggers. TODO: Refactor to be more awesome.
  self._dispatcher = function (data) {

    var replace = self.idCheck 
                  ? '+' + self.channels[data.to].commandString 
                  : self.channels[data.to].commandString,
        command = data.text.replace(replace, '').split(' ');

    if ( (command[0] !== 'config')
    && (typeof triggers[command[0]] !== 'undefined') ) {
      triggers[command[0]].call(self, data, command);
    }
  };

  // Dispatch behavior for PMs
  // TODO: Refactor to be more awesome.
  self._dispatchPM = function (data) {
    var config = /^config\s(add|rm|set|get|save)\s?([\w\d#:._-]*)\s?(.*)$/,
        text = data.text.replace(/^\+!?/, ''),
        command;
    if (!config.test(text)) {
      command = text.split(' ');
      if (/-!(help|support)/.test(command[0])) {
        triggers[command[0].slice(1)].call(this, data, command);
      }
      else if (typeof triggers[command[0]] !== 'undefined') {
        data.to = data.nick;
        triggers[command[0]].call(this, data, command);
      }
    }
    else if (data.admin) { 
      command = text.match(config);
      triggers.config.call(this, data.nick, command[1], command[2], command[3]);
    }
  };


