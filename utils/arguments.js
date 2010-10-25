//splits up a string into arguments

//' and " strings are separated as well as non-whitespace
//arguments have whitespace following them
//"hello "world would become ["world"]

module.exports = function(text) {
	if(!text) return []
	var matcher = /(?:'(?:[^'\\]+|\\.)*'|"(?:[^"\\]+|\\.)*")(?=$|\s)/g
	var args = []
	var arg
	while(arg = matcher.exec(text)) {
		arg = arg[0]
		if(arg.charAt(0)==="'" || arg.charAt(0) ==='"') {
			arg = arg.slice(1,-1)
		}
		args.push(arg)
	}
	return args
}
