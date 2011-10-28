/*
 *
 * config.js - commands to configure Kohai on the fly
 *
 * (c) 2011 samsonjs & AvianFlu
 *
 */

var config = module.exports = function (name, operation, key, val) {
  // Permissions already checked, so no need here.
  // Thanks again to samsonjs for the config code.
  
  var self = this,
      repr,
      a, b;
  
  // get key
  if (operation === 'get') {
    if (!key) {
      self.emit('sendMsg', {dest: name, msg: 'Get what?'});
    }
    else if (!key.match(/^auth[:\w\d\s]*/)) {
      val = self.config.get(key);
      if (val && typeof val.join === 'function') {
        repr = '[' + val.join(', ') + ']';
      }
      else {
        repr = JSON.stringify(val);
      }
      self.emit('sendMsg', {dest: name, msg: key + ' is ' + repr});
    }
    else {
      self.emit('sendMsg', {dest: name, msg: 'Retrieval of authorization info not permitted.'});
    }
  }

  // set key json
  else if (operation === 'set') {
    try {
      self.config.set(key, JSON.parse(val));
      self.emit('sendMsg', {dest: name, msg: key + ' has been set to: ' + val + '.'});
    }
    catch (e) {
      self.emit('sendMsg', {dest: name, msg: 'Sorry, invalid JSON'});
    }
  }

  // add list-key value
  else if (operation === 'add') {
    a = self.config.get(key);
    if (!(a && typeof a.push === 'function')) {
      self.emit('sendMsg', {dest: name, msg: 'Sorry, cannot add to ' + key});
    }
    else if (a.indexOf(val) !== -1) {
      self.emit('sendMsg', {dest: name, msg: val + ' is already in ' + key});
    }
    else {
      a.push(val);
      self.config.set(key, a);
      self.emit('sendMsg', {dest: name, msg: val + ' was added to ' + key + '.'});
    }
  }

  // rm list-key value
  else if (operation === 'rm') {
    a = self.config.get(key);
    if (!(a && typeof a.filter === 'function')) {
      self.emit('sendMsg', {dest: name, msg: 'Sorry, cannot remove from ' + key});
      return;
    }
    b = a.filter(function (x) {
      return x !== val;
    });
    if (b.length < a.length) {
      self.config.set(key, b);
      self.emit('sendMsg', {dest: name, msg: val + ' was removed from ' + key + '.'});
    }
    else {
      self.emit('sendMsg', {dest: name, msg: val + ' was not found in ' + key + '.'});
    }
  }

  // save
  else if (operation === 'save') {
    self.config.save(function (err) {
      if (err) {
        self.emit('sendMsg', {dest: name, msg: err});
      }
      self.emit('sendMsg', {dest: name, msg: 'Config saved.'});
      self.emit('save');
    });
  }

  else {
    self.emit('sendMsg', {dest: name, msg: 'Sorry, ' + name + ', invalid operation for config.'});
  }
};
