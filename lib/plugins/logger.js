/* logger.js - plugin for logging IRC data to various transports */
var logger = module.exports;

// Winston is our multitransport logging library
var winston   = require('winston');

winston.add(winston.transports.File, { filename: './logs/all.log' });

logger.start = function (client, config) { 
  client.on('message', function (nick, to, text) { 
    winston.info(to + ' <' + nick + '> ' + text);
  });
};