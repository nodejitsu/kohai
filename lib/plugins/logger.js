/* logger.js - plugin for logging IRC data to various transports */
var logger = module.exports,
    _loggers = {};

// Winston is our multitransport logging library
var winston   = require('winston');

logger.start = function (client, config) { 
  client.on('message', function (nick, to, text) { 
    if (!_loggers[to]) {
      var logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)(),
          new (winston.transports.File)({ filename: './logs/all.log' }),
          new (winston.transports.File)({ filename: './logs/' + to + '.log' })
        ]
      });
      _loggers[to] = logger;
    }
    _loggers[to].info(to + ' <' + nick + '> ' + text);
  });
};

