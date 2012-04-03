/*
 *
 * kohai.js - The Kohai core.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var util = require('utile'),
    hook = require('./hook.io'),
    flatiron = require('flatiron'),
    path = require('path');

var kohai = module.exports = flatiron.app;

kohai.config.file({
  file: path.join(__dirname, '..', 'config.json')
});

// add a hook
// TODO: Make hook plugin use configs as-expected (may already have behavior)
kohai.use(hook);

kohai.start = function (port, cb) {
  kohai.init(cb);
};

// also access to http
kohai.use(flatiron.plugins.http);

// add a plugin that straps a router between hook.io-irc and kohai.irc
// will use irc: namespaced configs
kohai.use(require('./plugins/irc'));

// add a plugin that can interact with sendgrid
// kohai.use(require('./plugins/mailjitsu'));

// bootstrap some kohai plugins
// kohai.use(require('./plugins/kohai-plugins'));
