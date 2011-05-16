var encoder
module.exports = {
	encoder: encoder = require("./lib/encoder.js"),
	htmllegacy: encoder(require("./lib/htmllegacy.js")),
	html: encoder(require("./lib/htmllegacy.js")),
	xml: encoder(require("./lib/xml.js"))
}