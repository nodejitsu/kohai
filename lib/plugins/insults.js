/*
 *
 * insults.js - commands for sending random insults
 *
 * (c) 2011 Nodejitsu
 *
 */

exports.attach = function () {

};

exports.init = function () {

 //
 // Map commands to hook.io events
 //

};

var insults = {};

insults = exports;


insults.eventMap = {
  
  "insult" : function (data, callback) {
    //if (!data[this.ranks[2]]) { return false; }
    console.log(arguments);
    var n = Math.floor(Math.random() * insultList.length);
    //msg.slice(1).join(' ').replace(/[^\w\d\s]/g, '') ||
    callback(null, { msg : insultList[n].replace('%%', target) }); 
  }
  
};

//
// If any of these regexes match, respond accordingly. 
//

insults.commands = {
  /.*kohai.+sucks.*/: function (data, callback) {
    // respond here
    callback(null, { msg: 'No, you suck!' });
  },
  /.*kohai.+yo\smomma.*/: function (data, callback) {
    // respond here
    callback(null, { msg: 'No, yo momma!' });
  }
};

var insultList = [
  "%% is a wombat-loving heifer-puncher!",
  "%% is an unsightly trouser stain!",
  "%% is a venomous lily-licker!",
  "%% smells of elderberry wine!",
  "%% is like one of those callbacks that just won't fire.",
  "I slap thee verily with a trout quite large, %%!",
  "%% actually looks rather nice today."
];
