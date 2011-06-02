/* twitter.js - plugin for handling real-time communications with Twitter */
var twitobj = require('twitter'),
    levenshtein = require('levenshtein'),
    unshortener = require('unshortener');
    
var twitter = exports;
twitter.start = function (client, config){
  //var client = this
  var tracking = config.plugins.twitter.track
  if(!tracking) { tracking=[] }
  else { tracking = tracking.concat() }
  beQuiet = false
  
  if (!config.auth.twitter.consumer_key) {
    console.log("warn: twitter credentials not detected, disabling Twitter functionality".magenta);
  } else {

    twit = new twitobj(config.auth.twitter); 
    twit.verifyCredentials(function (data) {
      if (data.statusCode == 401) {
        console.log("err: twitter credentials have been rejected by the Twitter API.".red);
      } 
      else if(!config.plugins.twitter.userid) {
        config.plugins.twitter.userid = data.id;
      }
      
    });
  }
  
  
  Object.getOwnPropertyNames(config.plugins.irc.channels).forEach( function(channel, index) {
    config.plugins.irc.channels[channel].currentTweetCount = 0;
  });
  
  setInterval(function () {
    Object.getOwnPropertyNames(config.plugins.irc.channels).forEach( function(channel, index) {
      if (config.plugins.irc.channels[channel].currentTweetCount > 0) {
        config.plugins.irc.channels[channel].currentTweetCount--;
      }
    });
  }, 120000);
  
  Object.getOwnPropertyNames(config.plugins.irc.channels).forEach( function(channel, index) {
    client.on("rateChange"+channel, function (channel, rate) {
      if (rate > 10) {
        rate = 10;
      }
      
      if (config.plugins.irc.channels[channel].volume != 100) {  
        if ((config.plugins.irc.channels[channel].volume < 0)||(typeof config.plugins.irc.channels[channel].volume == 'undefined')) { 
          config.plugins.irc.channels[channel].volume = 0;
        }
        
        if ((10 - rate) <= config.plugins.irc.channels[channel].volume) {
          config.plugins.irc.channels[channel].volume = 10 - rate;
          config.plugins.irc.channels[channel].lastVolume = config.plugins.irc.channels[channel].volume;
        }
        else if ((10 - rate) > config.plugins.irc.channels[channel].volume ) {
          config.plugins.irc.channels[channel].lastVolume = config.plugins.irc.channels[channel].lastVolume + 0.05;
          config.plugins.irc.channels[channel].volume = Math.round(config.plugins.irc.channels[channel].lastVolume);
        } 
      }

      //console.log(channel, " rate is ", rate, ", volume is ", config.plugins.irc.channels[channel].volume, " tweets: ", config.plugins.irc.channels[channel].currentTweetCount);
    });
  });
  client.once("join", function (channel, nick) {
    
    // TODO: remove this typeof check
    // we should have knowledge of the current state of the twitter plugin
    if(typeof twit !== 'undefined'){

      try {
        console.log("info: attempting connection to Twitter stream API...".grey)
        twit.stream('statuses/filter', {track:config.plugins.twitter.track, follow:config.plugins.twitter.userid}, function(stream) {
          console.log("info: connection successful.  Awaiting tweets...".green)
          stream.on('data', function (data) {
            //if(!beQuiet) {
              if((data.text)&&((!data.text.match(/.*\bRT:?.*/i))&&(!data.retweeted)&&(data.user.lang == "en"))) {
                var tooClose = false;
                if (config.plugins.twitter.recentTweets.length > 0) {
                  config.plugins.twitter.recentTweets.forEach( function (tweet, index) {
                    var lev = new levenshtein(data.text, tweet);
                    if (lev.distance < config.plugins.twitter.filter) {
                      tooClose = true;
                    }
                  });
                }
                config.plugins.twitter.recentTweets.push(data.text);
                if (config.plugins.twitter.recentTweets.length > 100) {
                  config.plugins.twitter.recentTweets.shift();
                }
                if (!tooClose) {
                  config.channels.forEach(function (channel, index) {
                    if ((config.plugins.irc.channels[channel].volume / 2) > config.plugins.irc.channels[channel].currentTweetCount) {
                      data.text = data.text.replace(/\r/g, ' ').replace(/\n/g, ' ');
                      if ((!data.following)&&(config.plugins.twitter.autofollow)) {
                        twit.createFriendship(data.user.id, function (followObj) {});
                      }
                      shortlinks = data.text.match(/http:\/\/\S{4,10}\/\S{3,8}\b/i);
                      if (shortlinks != null) {
                        shortlinks.forEach(function (shortlink, index) {
                          unshortener.expand(shortlink, function (url) {
                            if (url.href !== shortlink) {
                              console.log(shortlink, " ", url.href);
                              client.say(channel, "@" + data.user.screen_name + ": " + data.text + " (link: " + url.href + ")");
                            }
                            else { client.say(channel, "@" + data.user.screen_name + ": " + data.text); }
                          });
                        });
                      }
                      else {
                        client.say(channel, "@" + data.user.screen_name + ": " + data.text);
                      }
                      config.plugins.irc.channels[channel].currentTweetCount++;
                    }
                  });
                }
                else {
                  console.log("Tweet suppressed: ", data.text);
                }
                //console.log("@" + data.user.screen_name + ": " + data.text)
              }
            //}
          });
        });
      }
      catch(error) { 
        // Squash error for now
        // TODO: throw error somewhere it can be caught
        //console.log(error.stack); 
      }
      
    }
  })
}
