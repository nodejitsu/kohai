module.exports = function(config) {
	var client = this 
	var auth = config.auth
	if(config.auth) {
		auth = auth.freenode
		if(auth) {
			this.on("motd",function motd(){ 
				client.say("nickserv","identify "+auth.password)
                                console.log("Connected to freenode...")
                        })
                        this.on("message#nodetestsu", function (from, message){
                                console.log(from, " : ", message)
                                var talkSmack = message.match(/\bbot\b/i)
                                var intro = message.match(/\bkohai\b/i)
                                if(talkSmack) client.say("#nodetestsu", "'Bot' is a derogatory term, and I'm offended.")
                                if(intro) client.say("#nodetestsu", "I am Kohai, semi-useful communications-facilitating pseudointelligence!")
                        })
		}
	}
}