var OAuth = require("oauth").OAuth

module.exports = function(config) {
	var client = this
	var auth = config.auth
	if(auth) {
		auth = auth.twitter
		if(auth) {
			var access_token
			var access_token_secret
			
			var tracking = config.plugins.twitter.track
			if(!tracking) {
				tracking=[]
			}
			else {
				tracking = tracking.concat()
			}
			
			var oa= new OAuth(
				"http://api.twitter.com/oauth/request_token",
				"http://api.twitter.com/oauth/access_token",
				auth["api-key"],
				auth["api-secret"],
				"1.0",
				null,
				"HMAC-SHA1"
			)
			var tracking_stream
			function track() {
				if(tracking_stream) tracking_stream.end()
				console.log("tracking twitter on: "+tracking.join(","))
				oa.post(
					"http://stream.twitter.com/1/statuses/filter.json",
					access_token,
					access_token_secret,
					"track="+tracking.join(",")+"&count=0",
					function (error, data, response) {
						if(error) {
							console.log(data)
							if(response) response.on("data",function(data){console.log(data)})
							console.log('error (tracking twitter):' + error)
							console.log(error)
						}
						else {
							tracking_stream = response
							response.on("data",function(data) {
								var statuses = data.match(/<text>[^<]*?<\/text>/g)
								var screen_names = data.match(/<screen_name>[^<]*?<\/screen_name>/g)
								if(statuses) {
									statuses = statuses.map(function(status) {
										return status.replace(/^<text>|<\/text>$/g,"")
									})
									screen_names = screen_names.map(function(name) {
										return name.replace(/^<screen_name>|<\/screen_name>$/g,"")
									})
									status.forEach(function(status,index) {
										client.say("nodejsbots",html.decode(status)+" --http://twitter.com/"+screen_names[index])
									})
								}
							})
							response.on("end",track)
						}
					}
				)
			}
			function hookup() {
				client.triggers.tweet = function(name,to,message,text) {
					oa.post(
						"http://api.twitter.com/1/statuses/update.json?status="+message.replace(/^[!]tweet\s*/,""),
						access_token,
						access_token_secret,
						"",
						function (error, data, response) {
							if(error) {
								console.log('error :' + error)
								console.log(error)
							}
							else {
								console.log(data);
							}
						}
					);
				}
				client.triggers.watchtwitter = function watchtwitter(name,to,message,pattern) {
					var terms = message.replace(/^[!]tweet\s*/,"").split(",")
					tracking.filter(function(item) {
						for(var i = 0;i < terms.length;i++) {
							if(terms[i].trim() == item.trim()) {
								return false
							}
						}
						return true
					})
					track()
				}
				client.triggers.watchtwitter = function watchtwitter(name,to,message,pattern) {
					tracking.concat(message.replace(/^[!]tweet\s*/,"").split(",").map(function(item){
						return item.trim()
					}))
					track()
				}
				track()
			}
			function get_PIN() {
				require("../utils/stdin")("Please enter twitter PIN (https://twitter.com/oauth/authorize?oauth_token="+auth.request_token+"):","PIN",function(variables) {
					console.log("PIN: "+variables.PIN)
					oa.getOAuthAccessToken(auth.request_token, auth.request_token_secret, String(variables.PIN).trim(), function(error, oauth_access_token, oauth_access_token_secret, results2) {
						if(error) {
							console.log('error :' + error)
							console.log(error)
						}
						else {
							console.log('oauth_access_token :' + oauth_access_token)
							console.log('oauth_token_secret :' + oauth_access_token_secret)
							console.log('accesstoken results :' + require("sys").inspect(results2))
				 			console.log("Requesting access token")
				 		
							access_token = oauth_access_token
							access_token_secret =  oauth_access_token_secret
							hookup()	
						}
					})
				})
			}
			if(auth["access-token"]) {
				if(auth["access-token-secret"]) {
					access_token = auth["access-token"]
					access_token_secret =  auth["access-token-secret"]
					console.log("using saved twitter tokens")
					hookup()
					return
				}
			}
			oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
				if(error) {
					console.log('error :' + error)
					console.log(error)
				}
				else { 
					console.log('oauth_token (can be saved in config.auth.twitter.access-token):' + oauth_token)
					console.log('oauth_token_secret (can be saved in config.auth.twitter.access-token-secret):' + oauth_token_secret)
					console.log('requestoken results :' + require("sys").inspect(results))
					console.log("Requesting access token")
					
					auth.request_token = oauth_token
					auth.request_token_secret = oauth_token_secret
					get_PIN()
				 }
			})
		}
	}
}
