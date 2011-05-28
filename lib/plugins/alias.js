/* alias.js - stores various triggers for kohai that don't fit in any specific plugin */
var alias = module.exports;
alias.start = function (client, config) {
  
  var whitelist = config.plugins.alias.whitelist;

  //
  //Triggers here are sensitive commands and only for whitelisted IRC users.
  //
  
  client.triggers = {
  
    "tweet" : function (channel, name, message) {
      if (typeof twit !== 'undefined') {
        var re = new RegExp("^"+config.plugins.irc.channels[channel].command_string+"tweet\\s(.{1,140})", "i");
        var tweet = re.exec(message);
        twit.updateStatus(tweet[1], function (data) {
          console.log("Tweeted: " + tweet[1] + " For: " + name)
        });
      }
      else {
        client.say(channel, "Sorry, my Twitter connection is not currently available.");
      }
    },
    
    "insult" : function (channel, name, message, targ) {
      var n = Math.floor(Math.random() * 6);
      switch(n) {
        case 0:
          client.say(channel, targ + " is a wombat-loving heifer-puncher!");
          break;
        case 1:
          client.say(channel, targ + " is an unsightly trouser stain!");
          break;
        case 2:
          client.say(channel, targ + " is a venomous lily-licker!");
          break;
        case 3:
          client.say(channel, targ + " smells of elderberry wine!");
          break;
        case 4:
          client.say(channel, targ + " has a mother for a father!");
          break;
        default:
          client.say(channel, targ + " actually looks rather nice today.");
      }
      
    },
    
    "join" : function (channel, name, message, targ) {
      client.join(targ, function () {
        client.emit('userjoin', channel);
        addTriggerListener(targ);
        config.channels.push(targ);
        if (!config.plugins.irc.channels[targ]){
          config.plugins.irc.channels[targ] = config.plugins.irc.channelDefault;
        }
        client.say(channel, "I have now also joined "+targ);
        console.log("Joined channel ", targ, " at the behest of ", name);
      });
    },
    
    "part" : function (channel, name, message, targ) {
      client.part(targ);
      client.removeAllListeners("message"+targ);
      clearInterval(config.plugins.irc.channels[channel].interval);
      config.channels = config.channels.filter( function (item) { 
        return item !== targ; 
      });
    },
  
    "gtfo" : function (channel, name, message) { 
      console.log(name, " has issued gtfo command from channel ", channel)
      client.disconnect();
      process.exit(0);
    },
    
    "mute" : function (channel) {
      if(!beQuiet) {
        beQuiet = true;
        alias.timer = setTimeout(function(){
          if(beQuiet) {
            beQuiet = false; 
            client.say(channel, "Twitter mute expired.");
          }
        }, (config.plugins.irc.channels[channel].mute_timer * 1000));
        client.say(channel, "Twitter stream muted for the next "+config.plugins.irc.channels[channel].mute_timer+" seconds.");
      }
      else { client.say(channel, "Already muted!") }
    },
    
    "unmute" : function (channel) {
      if(beQuiet){
        beQuiet = false;
        client.say(channel, "Twitter mute cancelled.");
        clearTimeout(alias.timer);
      }
      else { client.say(channel, "Not currently muted!"); }
    },
    
    "kick" : function (channel, user, message, targ) {
      console.log(user, " has been kicked from ", channel);
      client.say(channel, "kohai says GTFO!");
      client.send('kick ', channel, targ);
    },
    
    "ban" : function (channel, user, message, targ) {
      client.say(channel, "BEHOLD THE MIGHT OF THE BANHAMMER!");
      console.log(targ, " has been banned from ", channel, " at the request of ", user);
      client.send('MODE', channel, '+b', targ);
      client.send('kick ', channel, targ);
    },
    
    "unban" : function (channel, user, message, targ) {
      client.say(channel, "Mercy has been bestowed upon " + targ);
      console.log(targ, " has been unbanned from ", channel, " at the request of ", user);
      client.send('MODE', channel, '-b', targ);
    },
    
    "stfu" : function (channel, user, message, targ) {
      client.say(channel, targ + "'s Gross Adjusted Noobosity has exceeded specified telemetry parameters.  " + config.plugins.irc.mute_timer + " second mute has been initiated.");
      console.log(targ, " has been muted for ", config.plugins.irc.mute_timer, " seconds.");
      client.send('MODE', channel, '+q', targ);
      setTimeout(function(){
          client.send('MODE', channel, '-q', targ); 
          client.say(channel, "Noobosity telemetry data now below thresholds.  Removing mute for "+targ+".")
        }, (config.plugins.irc.mute_timer * 1000));
    },
      
    "config" : function (channel, name, message, operation, key) {
      // val will be incorrect if the value includes a space, get the real value from message
      var val = message.replace(RegExp('^.*' + key + '\\s+'), '')

      // get key
      if (operation == "get") {
        if (!key) { client.say(channel, "Get what?"); }
        else if (!key.match(/^auth.*/)) {
          var repr
          val = client.conf(key)
          if (val && typeof val.join === 'function') {
            repr = '[' + val.join(', ') + ']'
          }
          else {
            repr = JSON.stringify(val)
          }
          client.say(channel, key + ' is ' + repr)
        }
        else { client.say(channel, "In-channel retrieval of authorization info not permitted."); }
      }

      // set key json
      else if (operation == "set") {
        try {
          client.conf(key, JSON.parse(val))
          client.say(channel, key + ' has been set to: ' + val + '.')
        }
        catch (e) {
          client.say(channel, 'Sorry, invalid JSON')
        }
      }

      // add list-key value
      else if (operation == "add") {
        var a = client.conf(key)
        if (!(a && typeof a.push === 'function')) {
          client.say(channel, 'Sorry, cannot add to ' + key)
        }
        else if (a.indexOf(val) !== -1) {
          client.say(channel, val + ' is already in ' + key)
        }
        else {
          a.push(val)
          client.conf(key, a)
          client.say(channel, val + ' was added to ' + key + '.')
        }
      }

      // rm list-key value
      else if (operation == "rm") {
        var a = client.conf(key)
        if (!(a && typeof a.filter === 'function')) {
          client.say(channel, 'Sorry, cannot remove from ' + key)
          return
        }
        var b = a.filter(function(x) { return x !== val })
        if (b.length < a.length) {
          client.conf(key, b)
          client.say(channel, val + ' was removed from ' + key + '.')
        }
        else {
          client.say(channel, val + ' was not found in ' + key + '.')
        }
      }

      // save
      else if (operation == "save") {
        client.saveConfig(function (err) {
          if (err) {
            err.message = "Error saving config.json to disk."
            client.say(channel, err.message)
            throw err
          }
          client.say(channel, 'Config saved.')
        })
      }

      else {
        client.say(channel, 'Sorry, ' + name + ', invalid operation for config.')
      }
    }
  }
  
  config.channels.forEach(function (channel, index) {addTriggerListener(channel);});
  
  function addTriggerListener(channel) {
    client.on("message" + channel,function triggerListener(from, message) {
      for (var i=0; i<whitelist.length; i++) {
        if (whitelist[i] == from) {
          re = new RegExp("^"+config.plugins.irc.channels[channel].command_string+"(\\S+)(.*|$)?", "i")
          var trigger_match = message.match(re)
          if(trigger_match) {
            var trigger = trigger_match[1]
            var handler = client.triggers[trigger]
            if(handler) {
              if((trigger_match[2])&&(handler !== 'tweet')) {
                trigger_match[2] = trigger_match[2].replace(/^\s/, '')
                var args = trigger_match[2].split(/\s/)
              }
              else {var args = []}
              handler.apply(client,[channel,from,message].concat(args));
            }
          }
        }
      }
    });
  }
}

