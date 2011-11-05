/*
 *
 * comments.js - Kohai's IRC auto-responses.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var comments = module.exports = function (data) {
  
  switch(true) {
    case /\bkohai\b.*\bbot\b.*/i.test(data.text):
      this.emit('sendMsg', {
        dest: data.to, 
        msg: '\'Bot\' is a derogatory term, and I\'m offended.' 
      });
      break;
    case /.*\bkohai:(?:\s|$).*/i.test(data.text):
      this.emit('sendMsg', {
        dest: data.to, 
        msg: 'I am Kohai, semi-useful communications-facilitating pseudointelligence!' 
      });
      break;
    default:
      // This is the no-match case, do nothing.
      break;
  }

}