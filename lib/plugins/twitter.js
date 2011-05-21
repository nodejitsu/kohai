/* twitter.js - plugin for handling real-time communications with Twitter */

module.exports = function(config){
  var client = this
  
  twitter = require('twitter');

  var tracking = config.plugins.twitter.track
  if(!tracking) { tracking=[] }
  else { tracking = tracking.concat() }
  beQuiet = false
  
  if (!config.auth.twitter.consumer_key) {
    console.log("warn: twitter credentials not detected, disabling Twitter functionality".magenta)
  } else {

    twit = new twitter(config.auth.twitter); 
    twit.verifyCredentials(function (data) { 
      if (data.statusCode == 401) {
        console.log("err: twitter credentials have been rejected by the Twitter API.".red)
      }
    });

  }

    
  client.once("join", function (channel, nick) {
    config.channels.forEach(function (channel, index) { 
      client.say(channel, "I am Kohai, semi-useful communications-facilitating pseudointelligence!")
    })
    
    // TODO: remove this typeof check
    // we should have knowledge of the current state of the twitter plugin
    if(typeof twit !== 'undefined'){

      try {
        console.log("info: attempting connection to Twitter stream API...".grey)
        twit.stream('user', {track:config.plugins.twitter.track}, function(stream) {
          console.log("info: connection successful.  Awaiting tweets...".green)
          stream.on('data', function (data) {
            if(!beQuiet) {
              if((data.text)&&((!data.text.match(/.*\bRT:?.*/i))&&(!data.retweeted))) {
                config.channels.forEach(function (channel, index) {
                  client.say(channel, "@" + data.user.screen_name + ": " + data.text)
                })
                //console.log("@" + data.user.screen_name + ": " + data.text)
              }
            }
          })
        })
      }
      catch(error) { 
        // Squash error for now
        // TODO: throw error somewhere it can be caught
        // console.log(error); 
      }
      
    }
  })
}