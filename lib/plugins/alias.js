module.exports = function (config) {
  
  var client = this
  
  //
  //Triggers here are sensitive commands and only for whitelisted users
  //
  
  client.triggers = {
  
    "tweet" : function (channel, name, message) {
      var re = new RegExp("^"+config.plugins.freenode.command_string+"tweet\\s(.{1,140})", "i")
      var tweetMatch = re.exec(message)
      twit.updateStatus(tweetMatch[1], function (data) {
        console.log("Tweeted: " + tweetMatch[1] + " For: " + name)
      })
    },
    
    "insultme" : function (channel, name, message) {
      client.say(channel, name + " is a wombat-loving heifer-puncher!")
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
        }, 60000)
        client.say(channel, "Twitter stream muted for the next 60 seconds.")
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
              var args = arghelper(trigger_match[2])
              handler.apply(client,[channel,from,message].concat(args));
            }
          }
        }
      }
    })
  })
}