/*
 *
 * kohai.js - The Kohai core.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var util = require('utile'),
    flatiron = require('flatiron'),
    path = require('path');

var core = require('./core');

var kohai = module.exports = flatiron.app;

kohai.config.file({
  file: path.join(__dirname, '..', 'config.json')
});

kohai.start = function (cb) {
  kohai.init({}, cb);
};

// also access to http
kohai.use(core, {});
