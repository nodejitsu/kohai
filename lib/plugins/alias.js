/* alias.js - stores various triggers for kohai that don't fit in any specific plugin */
var alias = module.exports;
alias.start = function (client, config) {
  
  var whitelist = config.plugins.alias.whitelist;

  //
  //Triggers here are sensitive commands and only for whitelisted IRC users.
  //
  
  client.triggers = {
  
    'help' : function (channel, name, message, command) {
      client.emit('help', name, command);
    },
    
    'shorten': function (channel, name, message, url) {
      client.emit('shorten', name, url);
    },
    
    'tweet' : function (channel, name, message) {
      if (typeof twit !== 'undefined') {
        var re = new RegExp('^\\+'+config.plugins.irc.channels[channel].command_string+'tweet\\s(.{1,140})', 'i');
        var tweet = re.exec(message);
        twit.updateStatus(tweet[1], function (data) {
          console.log('Tweeted: ' + tweet[1] + ' For: ' + name);
        });
      }
      else {
        client.say(channel, 'Sorry, my Twitter connection is not currently available.');
      }
    },

    'calc' : function (channel) {
      var expression = Array.prototype.slice.call(arguments, 3),

      doMath = function (expr) {
        var op = expr.join("").replace(/[^0-9\+\*\-\/\(\)]/g, ""),
            result = 0;

        try {
          result = eval(op);
        } catch (e) { };

        return result;
      };

      client.say(channel, doMath(expression));
    },
    
    'insult' : function (channel, name, message, targ) {
      var n = Math.floor(Math.random() * 6);
      var insult = config.insults[n].replace(/%%/, targ);
      client.say(channel, insult);
    },
    
    'join' : function (channel, name, message, targ) {
      client.join(targ, function () {
        addTriggerListener(targ);
        config.channels.push(targ);
        if (!config.plugins.irc.channels[targ]){
          config.plugins.irc.channels[targ] = config.plugins.irc.channelDefault;
        }
        client.say(channel, 'I have now also joined '+targ);
        console.log('Joined channel ', targ, ' at the behest of ', name);
        client.emit('userjoin', targ);
      });
    },
    
    'part' : function (channel, name, message, targ) {
      client.part(targ);
      client.removeAllListeners('message'+targ).removeAllListeners('rateChange'+targ);
      clearInterval(config.plugins.irc.channels[channel].interval);
      config.channels = config.channels.filter( function (item) { 
        return item !== targ; 
      });
    },
  
    'gtfo' : function (channel, name, message) { 
      console.log(name, ' has issued gtfo command from channel ', channel)
      client.disconnect('https://github.com/nodejitsu/kohai');
      process.exit(0);
    },
    
    'mute' : function (channel) {
      if(config.plugins.irc.channels[channel].volume > 0) {
        config.plugins.irc.channels[channel].volume = 0;
        config.plugins.irc.channels[channel].lastVolume = 0;
        client.say(channel, 'Volume set to 0.');
      }
      else { client.say(channel, 'Already muted!') }
    },
    
    'unmute' : function (channel) {
      if(config.plugins.irc.channels[channel].volume < 10){
        config.plugins.irc.channels[channel].volume = 10;
        config.plugins.irc.channels[channel].lastVolume = 10;
        client.say(channel, 'Volume set to 10.');
      }
      else { client.say(channel, 'Already full volume!'); }
    },
    
    'kick' : function (channel, user, message, targ) {
      console.log(user, ' has been kicked from ', channel);
      client.say(channel, 'kohai says GTFO!');
      client.send('kick ', channel, targ);
    },
    
    'ban' : function (channel, user, message, targ) {
      client.say(channel, 'BEHOLD THE MIGHT OF THE BANHAMMER!');
      console.log(targ, ' has been banned from ', channel, ' at the request of ', user);
      client.send('MODE', channel, '+b', targ);
      client.send('kick ', channel, targ);
    },
    
    'unban' : function (channel, user, message, targ) {
      client.say(channel, 'Mercy has been bestowed upon ' + targ);
      console.log(targ, ' has been unbanned from ', channel, ' at the request of ', user);
      client.send('MODE', channel, '-b', targ);
    },
    
    'stfu' : function (channel, user, message, targ) {
      client.say(channel, 'Gross Adjusted Noobosity of ' + targ + ' has exceeded specified telemetry parameters.  ' + config.plugins.irc.mute_timer + ' second mute has been initiated.');
      console.log(targ, ' has been muted for ', config.plugins.irc.mute_timer, ' seconds.');
      client.send('MODE', channel, '+q', targ);
      setTimeout(function(){
          client.send('MODE', channel, '-q', targ); 
          client.say(channel, 'Noobosity telemetry data now below thresholds.  Removing mute for '+targ+'.')
        }, (config.plugins.irc.mute_timer * 1000));
    },
    
    'report' : function (channel, name, message, targ) {
      twit.reportSpam(targ, function (reportSpamObj) {
        console.log(reportSpamObj);
        client.say(channel, 'I have reported '+targ+' to the Twitter API as a spammer.');
      });
      twit.createBlock(targ, function (replyObj) {
        console.log(targ, ' has been blocked.');
        client.say(channel, targ + ' has also been blocked.');
      });
    },
      
    'config' : function (name, message, operation, key, val) {
      // val will be incorrect if the value includes a space, get the real value from message
      //var val = message.replace(RegExp('^.*' + key + '\\s+'), '')
      //The above is fixed by the pm handler?  I think?
      // get key
      if (operation == 'get') {
        if (!key) { 
          client.say(name, 'Get what?'); 
        }
        else if (!key.match(/^auth.*/)) {
          var repr;
          val = client.conf(key)
          if (val && typeof val.join === 'function') {
            repr = '[' + val.join(', ') + ']'
          }
          else {
            repr = JSON.stringify(val)
          }
          client.say(name, key + ' is ' + repr)
        }
        else { 
          client.say(name, 'Retrieval of authorization info not permitted.'); 
        }
      }

      // set key json
      else if (operation == 'set') {
        try {
          client.conf(key, JSON.parse(val))
          client.say(name, key + ' has been set to: ' + val + '.')
        }
        catch (e) {
          client.say(name, 'Sorry, invalid JSON')
        }
      }

      // add list-key value
      else if (operation == 'add') {
        var a = client.conf(key)
        if (!(a && typeof a.push === 'function')) {
          client.say(name, 'Sorry, cannot add to ' + key)
        }
        else if (a.indexOf(val) !== -1) {
          client.say(name, val + ' is already in ' + key)
        }
        else {
          a.push(val)
          client.conf(key, a)
          client.say(name, val + ' was added to ' + key + '.')
        }
      }

      // rm list-key value
      else if (operation == 'rm') {
        var a = client.conf(key)
        if (!(a && typeof a.filter === 'function')) {
          client.say(name, 'Sorry, cannot remove from ' + key)
          return
        }
        var b = a.filter(function(x) { return x !== val })
        if (b.length < a.length) {
          client.conf(key, b)
          client.say(name, val + ' was removed from ' + key + '.')
        }
        else {
          client.say(name, val + ' was not found in ' + key + '.')
        }
      }

      // save
      else if (operation == 'save') {
        client.saveConfig(function (err) {
          if (err) {
            err.message = 'Error saving config.json to disk.'
            client.say(name, err.message)
            throw err
          }
          client.say(name, 'Config saved.')
        })
      }

      else {
        client.say(name, 'Sorry, ' + name + ', invalid operation for config.')
      }
    }
  }
  
  client.on('pm', function (nick, msg) {
    for (var i=0; i<whitelist.length; i++) {
      if (whitelist[i] == nick) {
        var command = msg.match(/^\+config\s(add|rm|set|get|save)\s?([\w\d#:\.]*)\s?(.*)/); 
        if (command) {
          client.triggers.config.call(client, nick, msg, command[1], command[2], command[3]);
        }
        break;
      }
    }
  });
  
  config.channels.forEach(function (channel, index) {addTriggerListener(channel);});
  
  function addTriggerListener(channel) {
    client.on('message' + channel,function triggerListener(from, message) {
      for (var i=0; i<whitelist.length; i++) {
        if (whitelist[i] == from) {
          var re = new RegExp('^\\+'+config.plugins.irc.channels[channel].command_string+'(\\S+)(.*|$)', 'i')
          var trigger_match = message.match(re)
          if ((trigger_match)&&(trigger_match !== 'config')) {
            var trigger = trigger_match[1]
            var handler = client.triggers[trigger]
            if (handler) {
              if ((trigger_match[2])&&(handler !== 'tweet')) {
                trigger_match[2] = trigger_match[2].replace(/^\s/, '')
                var args = trigger_match[2].split(/\s/)
              }
              else {
                var args = [];
              }
              handler.apply(client,[channel,from,message].concat(args));
            }
          }
        break;
        }
      }
    });
  }
}
