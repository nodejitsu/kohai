module.exports = function (config) {

    var client = this
    var whitelist = config.plugins.alias.whitelist
    client.triggers = {
                            "insultme" : function (channel, name, message) {
                                    client.say(channel, name + " is a wombat-loving heifer-puncher!")
                                },
        
                            "gtfo" : function (channel, name, message) { process.exit() },
                            
                            "mute" : function (channel) {
                                if(!beQuiet) {
                                    beQuiet = true
                                    setTimeout(function(){
                                        beQuiet = false 
                                        client.say(channel, "Twitter mute expired")
                                    }, 60000)
                                    client.say(channel, "Twitter stream muted for next 60 seconds.")
                                }
                                else { client.say(channel, "Already muted!") }
                            },
                            
                            "unmute" : function (channel) {
                                if(beQuiet){
                                    beQuiet = false
                                    client.say(channel, "Twitter mute cancelled")
                                }
                                else { client.say(channel, "Not currently muted!") }
                            }
                      }
    config.channels.forEach(function (channel, index) {
        client.on("message" + channel,function triggerListener(from, message) {
                for (var i=0; i<whitelist.length; i++) {
                    if (whitelist[i] == from) {
                        var trigger_match = message.match(/^[!](\S+)(.*|$)?/)
                        if(trigger_match) {
                                var trigger = trigger_match[1]
                                
                                var handler = client.triggers[trigger]
                                if(handler) {
                                        var args = arghelper(trigger_match[2])
                                        handler.apply(client,[channel,from,message].concat(args));
                                }
                        }
                    }
                }
        })
    })
 
 
 
 
 }
