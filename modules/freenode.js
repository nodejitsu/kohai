module.exports = function(config) {
	var client = this
	var auth = config.auth
	if(config.auth) {
		auth = auth.freenode
		if(auth) {
			this.on("motd",function motd(){
				client.say("nickserv","identify "+auth.password)
			})
		}
	}
}
