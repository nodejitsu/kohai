/*
 *
 * kohai.js - The Kohai core.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var util = require('utile'),
    hook = require('hookio-broadway'),
    flatiron = require('flatiron');

var kohai = module.exports = flatiron.app;
kohai.use(hook, {
  name: 'MrKohai',
  debug: true
});
kohai.use(require('./plugins/irc'));
