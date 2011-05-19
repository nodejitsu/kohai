var translate = require("translate")
var html = require("JS-Entities").html
module.exports = function(config) {

	//!translate lang:lang text
	this.triggers.translate = function(name,to,message,languages,text) {
		//figure out who to respond to
		//if it was a private message to me, respond to the person
		//if it was to a room and not me specificall, reply in the room
		var destination = to === this.nick
			? name
			: to
		
		var client = this
		if(text) {
			var pair = languages.split(/[:]/)

			translate.text({input:pair[0],output:pair[1]},text,function(txt) {
				//respond with the translated test, decoding the html entities
				client.say(destination,html.decode(txt))
			})
		}
		else {
			translate.text(languages,function(txt) {
				//respond with the translated test, decoding the html entities
				client.say(destination,html.decode(txt))
			})	
		}
	}
}
