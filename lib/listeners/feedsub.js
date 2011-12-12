/*
 *
 * listeners/feedsub.js - Event listeners for Hook.io-feedsub.
 *
 *
 *  Written by willwh.
 *
 */

var feedsub = module.exports = function () {
  var self = this;
  self.on('feedsub::*::item', function (data) {
    self.sayRSS(data.title + ' - ' + data.link);
  });
};
