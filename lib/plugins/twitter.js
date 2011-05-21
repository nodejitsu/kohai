/* twitter.js - plugin for handling real-time communications with Twitter */

module.exports = function(config){
  var client = this
  
  twitter = require('twitter');

  var tracking = config.plugins.twitter.track
  if(!tracking) { tracking=[] }
  else { tracking = tracking.concat() }
  beQuiet = false
  
  if (!config.auth.twitter.consumer_key) {
    console.log("Twitter credentials not detected.".magenta)
    process.exit()
  }
  
  twit = new twitter(config.auth.twitter); 
  twit.verifyCredentials(function (data) { 
    if(data.statusCode == 401) {
      console.log("Twitter credentials have been rejected by the Twitter API.".red)
      process.exit()
    }
    
  })

    
  client.once("join", function (channel, nick) {
    config.channels.forEach(function (channel, index) { 
      client.say(channel, "I am Kohai, semi-useful communications-facilitating pseudointelligence!")
    })
    try {
      console.log("Attempting connection to Twitter stream API...".grey)
      twit.stream('user', {track:config.plugins.twitter.track}, function(stream) {
        console.log("Connection successful.  Awaiting tweets...".green)
        stream.on('data', function (data) {
          if(!beQuiet) {
            if((data.text)&&((!data.text.match(/.*\bRT:?.*/i))&&(!data.retweeted))) {
              config.channels.forEach(function (channel, index) {
                client.say(channel, "@" + data.user.screen_name + ": " + data.text)
              })
              console.log("@" + data.user.screen_name + ": " + data.text)
            }
          }
        })
      })
    }
    catch(error) { 
      console.log(error); 
      process.exit(); 
    }
  })
}