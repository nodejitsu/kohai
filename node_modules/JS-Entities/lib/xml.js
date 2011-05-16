var xml = module.exports = {}
var htmllegacy = require("./htmllegacy.js")
for(var k in htmllegacy) {
	xml[k] = htmllegacy[k]
}
xml.entities = [
	["&amp;" , "\u0026"]
	,["&lt;" , "\u003C"]
	,["&gt;" , "\u003E"]
	,["&quot;" , "\u0022"]
	,["&apos;" , "\u0027"]
]