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
            if(channel == config.channels[0]) {
                client.say(config.channels[0], "Twitter Connection Successful!")
                twit.stream('user', {track:config.plugins.twitter.track}, function(stream) {
                    stream.on('data', function (data) {
                        console.log(sys.inspect(data));
                        if(data.text) {
                            client.say(config.channels[0], "@" + data.user.screen_name + ": " + data.text)
                            console.log(config.channels[0], "@" + data.user.screen_name + ": " + data.text)
                        }
                    })
                })
            }
        
        })
        /*twit.updateStatus('Test tweet from node-twitter/' + twitter.VERSION,
                function (data) {
                    sys.puts(sys.inspect(data));
                }
            );*/
}