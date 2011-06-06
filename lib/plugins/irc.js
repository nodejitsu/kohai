/* irc.js - plugin for dealing with irc */
var irc = module.exports;
irc.start = function (client, config) {
  //var client = this;
  var auth = config.auth;
  
  if(auth) {
    auth = auth.irc
    if(auth) {
      client.on("motd",function motd(){ 
        client.say("nickserv","identify "+auth.password)
        console.log("info: connected to freenode!".green)
        emitRate(client, config);
        client.send('CAP REQ IDENTIFY-MSG');
      });
      client.on("userjoin", function (channel) {
        irc.rateMonitor(client, config, channel);
        client.on("message"+channel, function () {
          config.plugins.irc.channels[channel].messageCount++;
        });
      });
      config.channels.forEach(function (channel, index) {
        client.on("message" + channel, function (from, message){
          //console.log(from, " : ", message)
          //
          //Triggers here are for conversational actions available to any IRC user
          //
          var talkSmack = message.match(/\bkohai\s.*\bbot\b/i)
          var intro = message.match(/.*\bkohai:(?:\s|$).*/i)
          if(talkSmack) client.say(channel, "'Bot' is a derogatory term, and I'm offended.")
          if(intro) client.say(channel, "I am Kohai, semi-useful communications-facilitating pseudointelligence!")
        })
        client.on("join" + channel, function (nick) {
          //console.log(nick, " has joined ", channel)
          if (config.plugins.irc.channels.hasOwnProperty(channel)) {
            config.plugins.irc.channels[channel].oplist.forEach(function (name, index) {
              if (nick == name) {client.send('MODE', channel, '+o', nick)}
            });
            config.plugins.irc.channels[channel].voicelist.forEach(function (name, index) {
              if (nick == name) {client.send('MODE', channel, '+v', nick)}
            });
            config.plugins.irc.channels[channel].banlist.forEach(function (name, index) {
              if (nick == name) {
                client.send('MODE', channel, '+b', nick);
                client.send('kick', channel, nick);
              }
            });
          }
        });
        client.on("part" + channel, function (nick, reason) {
          //console.log(nick, " has left ", channel, " because ", reason)
          //client.say(channel, "Bye " + nick + "!")
        });
      });
    }
  } 
}

function emitRate(client, config) {
  
  
  Object.getOwnPropertyNames(config.plugins.irc.channels).forEach( function(channel, index) {
    client.on('message'+channel, function (){
      config.plugins.irc.channels[channel].messageCount++;
    });
    
    irc.rateMonitor(client, config, channel);
    
    
  });

}

irc.rateMonitor = function (client, config, channel) {
  var timespan = 60;
  config.plugins.irc.channels[channel].interval = setInterval(function(){
    if (config.plugins.irc.channels[channel].rollingValues.length >= timespan) {
      config.plugins.irc.channels[channel].rollingValues.shift();
    }
    config.plugins.irc.channels[channel].rollingValues.push(config.plugins.irc.channels[channel].messageCount);
    config.plugins.irc.channels[channel].messageCount = 0;

    var sum = 0;

    config.plugins.irc.channels[channel].rollingValues.forEach(function(v) {
      sum += Number(v);
    });

    client.emit('rateChange'+channel, channel, sum);
    
  }, 1000);
}

