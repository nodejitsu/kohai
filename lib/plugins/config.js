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
  
  var self = this;
  
  // get key
  if (operation === 'get') {
    if (!key) { 
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Get what?'}); 
    }
    else if (!key.match(/^auth.*/)) {
      var repr;
      val = self.get(key);
      if (val && typeof val.join === 'function') {
        repr = '[' + val.join(', ') + ']'
      }
      else {
        repr = JSON.stringify(val)
      }
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: key + ' is ' + repr});
    }
    else { 
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Retrieval of authorization info not permitted.'}); 
    }
  }

  // set key json
  else if (operation === 'set') {
    try {
      self.set(key, JSON.parse(val))
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: key + ' has been set to: ' + val + '.'});
    }
    catch (e) {
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Sorry, invalid JSON'});
    }
  }

  // add list-key value
  else if (operation === 'add') {
    var a = self.get(key);
    if (!(a && typeof a.push === 'function')) {
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Sorry, cannot add to ' + key});
    }
    else if (a.indexOf(val) !== -1) {
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: val + ' is already in ' + key});
    }
    else {
      a.push(val)
      self.set(key, a)
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: val + ' was added to ' + key + '.'});
    }
  }

  // rm list-key value
  else if (operation === 'rm') {
    var a = self.get(key)
    if (!(a && typeof a.filter === 'function')) {
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Sorry, cannot remove from ' + key});
      return
    }
    var b = a.filter(function(x) { return x !== val })
    if (b.length < a.length) {
      self.set(key, b)
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: val + ' was removed from ' + key + '.'});
    }
    else {
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: val + ' was not found in ' + key + '.'});
    }
  }

  // save
  else if (operation === 'save') {
    self.save(function (err) {
      if (err) {
        self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: err});
      }
      self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Config saved.'})
    });
  }

  else {
    self.emit('i.sendMsg.o.sendMsg', {dest: name, msg: 'Sorry, ' + name + ', invalid operation for config.'});
  }
}
