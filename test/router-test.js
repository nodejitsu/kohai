var assert = require('assert'),
    vows = require('vows'),
    Router = require('../lib/router').Router;

vows.describe('kohai/router').addBatch({
  'When using the router': {
    topic: new Router(),
    'and setting up a route and dispatching it': {
      'with a parameter': {
        topic: function (router) {
          router.on('insult :name :how', this.callback.bind(this, null));
          router.dispatch('on', '!insult kohai hard');
        },
        'should fire the route with correct parameters': function (_, name, how) {
          assert.equal(name, 'kohai');
          assert.equal(how, 'hard');
        }
      }
    }
  }
}).export(module);
