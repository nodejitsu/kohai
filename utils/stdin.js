var stdin = process.openStdin()

var prompt_queue = []
var variable_queue = []
var callback_queue = []

var queue = module.exports = function queue(prompt,variable,callback) {
	prompt_queue.push(prompt)
	var queued = variable_queue.push(variable)
	callback_queue.push(callback)
	if(queued === 1) {
		flush()
	}
}
queue.variables = {}

stdin.on("data",function(data){
	var destination = variable_queue.shift()
	var callback = callback_queue.shift()
	if(destination) {
		var vars = queue.variables
		vars[destination] = data
		if(callback) {
			callback(vars)
		}
	}
	flush()
	
})

function flush() {
	var prompt = prompt_queue.shift()
	if(prompt) {
		console.log(prompt)
	}
}

