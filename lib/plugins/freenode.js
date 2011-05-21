module.exports = function(config) {
  var client = this 
  var auth = config.auth
  if(auth) {
    auth = auth.freenode
    if(auth) {
      client.on("motd",function motd(){ 
        client.say("nickserv","identify "+auth.password)
        console.log("Connected to freenode...")
      })
      
      config.channels.forEach(function (channel, index) {
        client.on("message" + channel, function (from, message){
          console.log(from, " : ", message)
          //
          //Triggers here are for conversational actions available to any IRC user
          //
          var talkSmack = message.match(/\bkohai\s.*\bbot\b/i)
          var intro = message.match(/.*\bkohai:(?:\s|$).*/i)
          if(talkSmack) client.say(channel, "'Bot' is a derogatory term, and I'm offended.")
          if(intro) client.say(channel, "I am Kohai, semi-useful communications-facilitating pseudointelligence!")
        })
        client.on("join" + channel, function (nick) {
          console.log(nick, " has joined ", channel)
          config.plugins.freenode.oplist.forEach(function (name, index) {
            if (nick == name) {client.send('MODE', channel, '+o', nick)}
          })
          config.plugins.freenode.voicelist.forEach(function (name, index) {
            if (nick == name) {client.send('MODE', channel, '+v', nick)}
          })
          config.plugins.freenode.banlist.forEach(function (name, index) {
            if (nick == name) {client.send('MODE', channel, '+b', nick)}
          })
        })
        client.on("part" + channel, function (nick, reason) {
          console.log(nick, " has left ", channel, " because ", reason)
          client.say(channel, "Bye " + nick + "!")
        })
      })
    }
  }
}