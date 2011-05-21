module.exports = function (config) {
  
  var client = this
  
  //
  //Triggers here are sensitive commands and only for whitelisted IRC users.
  //
  
  client.triggers = {
  
    "tweet" : function (channel, name, message) {
      var re = new RegExp("^"+config.plugins.freenode.command_string+"tweet\\s(.{1,140})", "i")
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
        }, (config.plugins.freenode.mute_timer * 1000))
        client.say(channel, "Twitter stream muted for the next "+config.plugins.freenode.mute_timer+" seconds.")
      }
      else { client.say(channel, "Already muted!") }
    },
    
    "unmute" : function (channel) {
      if(beQuiet){
        beQuiet = false
        client.say(channel, "Twitter mute cancelled.")
      }
      else { client.say(channel, "Not currently muted!") }
    }
  }
  
  config.channels.forEach(function (channel, index) {
    client.on("message" + channel,function triggerListener(from, message) {
      for (var i=0; i<whitelist.length; i++) {
        if (whitelist[i] == from) {
          re = new RegExp("^"+config.plugins.freenode.command_string+"(\\S+)(.*|$)?", "i")
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