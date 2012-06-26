// Flatiron plugin that adds a vanilla hook.
exports.name = 'hook.io';

var Hook = require('hook.io').Hook;

exports.attach = function attachHook (options) {
  this.hook = new Hook(options);
};

exports.init = function initHook (done) {
  this.hook.on('hook::ready', done);
  this.hook.start();
};
