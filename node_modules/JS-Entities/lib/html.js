var html = module.exports = {}
var htmllegacy = require("./htmllegacy.js")
for(var k in htmllegacy) {
	html[k] = htmllegacy[k]
}
html.entities = html.entities.concat().filter(function(pair){
	return pair[0].slice(-1) === ";"
})