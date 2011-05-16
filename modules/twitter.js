module.exports = function(config){
        var client = this
        console.log("twitter module started.")
        var sys = require('sys'),
            twitter = require('twitter');
        
        var tracking = config.plugins.twitter.track
	if(!tracking) { tracking=[] }
	else { tracking = tracking.concat() }
            
        var twit = new twitter({
            consumer_key: 'yeah',
            consumer_secret: 'no',
            access_token_key: 'creds',
            access_token_secret: 'here'
        }); 
        
        try {
        twit.verifyCredentials(function (data) { sys.puts(sys.inspect(data)) })
        }
        catch(error) { console.log(JSON.stringify(error); process.exit() }
        
        client.once("join", function (channel, nick) {
            if(channel == "#nodetestsu") {
                client.say("#nodetestsu", "Twitter Connection Successful!")
                twit.stream('user', {track:config.plugins.twitter.track}, function(stream) {
                    stream.on('data', function (data) {
                        console.log(sys.inspect(data));
                        if(data.text) client.say("#nodetestsu", data.user.screen_name + ": " + data.text);
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