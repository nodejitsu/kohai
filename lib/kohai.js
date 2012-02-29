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

var attach = ;

var init = function (done) {
  // Any async stuff we need to do should happen here.
  done();
};

kohai.use({
  attach: function attach(options) {

    // sync loading of plugins goes here

    //eg:
    // this.use(someOtherPlugin, itsOptions);

    // lazy loading of plugins from a directory should go here

    this.use(require('./irc'), options);
  },

  init: function init(done) {
    // async behavior goes here.
    done();
  }

}
