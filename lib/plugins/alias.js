/* alias.js - stores various triggers for kohai that don't fit in any specific plugin */

module.exports = function (config) {
  
  var client = this
  
  //
  //Triggers here are sensitive commands and only for whitelisted IRC users.
  //
  
  client.triggers = {
  
    "tweet" : function (channel, name, message) {
      var re = new RegExp("^"+config.plugins.irc.command_string+"tweet\\s(.{1,140})", "i")
      var tweetMatch = re.exec(message)
      twit.updateStatus(tweetMatch[1], function (data) {
        console.log("Tweeted: " + tweetMatch[1] + " For: " + name)
      })
    },
    
    "insult" : function (channel, name, message, targ) {
      client.say(channel, targ + " is a wombat-loving heifer-puncher!")
    },
  
    "gtfo" : function (channel, name, message) { 
      console.log(name, " has issued gtfo command from channel ", channel)
      process.exit() 
    },
    
    "mute" : function (channel) {
      if(!beQuiet) {
        beQuiet = true
        setTimeout(function(){
          beQuiet = false 
          client.say(channel, "Twitter mute expired.")
        }, (config.plugins.irc.mute_timer * 1000))
        client.say(channel, "Twitter stream muted for the next "+config.plugins.irc.mute_timer+" seconds.")
      }
      else { client.say(channel, "Already muted!") }
    },
    
    "unmute" : function (channel) {
      if(beQuiet){
        beQuiet = false
        client.say(channel, "Twitter mute cancelled.")
      }
      else { client.say(channel, "Not currently muted!") }
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
    
    "google" : function(channel, user, message, targ) {
      var query = message.replace('!google ', '');
      var google = client.google;
      google(query, function(results) {
        if (results.length) {
          client.say(channel, user + ': ' + results[0].titleNoFormatting + ' - ' + results[0].unescapedUrl);
        } else {
          client.say(channel, user+ ': Sorry, your search returned no results. query: ' + query);
        }
      });
    }
  }
  
  config.channels.forEach(function (channel, index) {
    client.on("message" + channel,function triggerListener(from, message) {
      for (var i=0; i<whitelist.length; i++) {
        if (whitelist[i] == from) {
          re = new RegExp("^"+config.plugins.irc.command_string+"(\\S+)(.*|$)?", "i")
          var trigger_match = message.match(re)
          if(trigger_match) {
            var trigger = trigger_match[1]
            var handler = client.triggers[trigger]
            if(handler) {
              if(trigger_match[2]) {
                trigger_match[2] = trigger_match[2].replace(/^\s/, '')
                var args = trigger_match[2].split(/\s/)
              }
              else {var args = []}
              handler.apply(client,[channel,from,message].concat(args));
            }
          }
        }
      }
    })
  })
}