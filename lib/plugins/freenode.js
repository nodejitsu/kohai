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
          var talkSmack = message.match(/\bkohai\s.*\bbot\b/i)
          var intro = message.match(/.*\bkohai.*/i)
          var tweet = message.match(/^!tweet\s/i)
          if(tweet) {
            whitelist.forEach(function (name, index) {
              if (name == from) {
                re = /^!tweet\s(.{1,140})/;
                var tweetMatch = re.exec(message);
                twit.updateStatus(tweetMatch[1], function (data) {
                  console.log("Tweeted: " + tweetMatch[1] + " For: " + from)
                })
              }
            })
          }
          if(talkSmack) client.say(channel, "'Bot' is a derogatory term, and I'm offended.")
          if(intro) client.say(channel, "I am Kohai, semi-useful communications-facilitating pseudointelligence!")
        })
      })
    }
  }
}