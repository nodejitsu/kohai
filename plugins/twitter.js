module.exports = function(config){
        var client = this
        console.log("twitter module started.")
        var sys = require('sys'),
            twitter = require('twitter');
        
        var tracking = config.plugins.twitter.track
	if(!tracking) { tracking=[] }
	else { tracking = tracking.concat() }
            
        twit = new twitter(config.auth.twitter); 
        
        try {
        twit.verifyCredentials(function (data) { sys.puts(sys.inspect(data)) })
        }
        catch(error) { console.log(JSON.stringify(error)); process.exit() }
        
        client.once("join", function (channel, nick) {
                config.channels.forEach(function (channel, index) { client.say(channel, "Twitter Connection Successful!")})
                try {
                    console.log("about to try twit.stream...")
                    twit.stream('user', {track:config.plugins.twitter.track}, function(stream) {
                        stream.on('data', function (data) {
                            //console.log(sys.inspect(data));
                            if((data.text)&&((!data.text.match(/.*\bRT:?.*/i))&&(!data.retweeted))) {
                                config.channels.forEach(function (channel, index) {
                                    client.say(channel, "@" + data.user.screen_name + ": " + data.text)
                                })
                                console.log("@" + data.user.screen_name + ": " + data.text)
                            }
                        })
                    })
                }
                catch(error) { console.log(JSON.stringify(error)); process.exit() }
            
        })
        /*twit.updateStatus('Test tweet from node-twitter/' + twitter.VERSION,
                function (data) {
                    sys.puts(sys.inspect(data));
                }
            );*/
}