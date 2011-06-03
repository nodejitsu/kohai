//Module to give short descriptions for kohai's command triggers.

var colors = require('colors');

var help = exports;

help.start = function (client, config) {
  client.on("help", function (nick, command) {
    if(!command) {
      client.say(nick, "Hi, this is kohai help!  Here is a list of my commands.");
      client.say(nick, "Arguments are listed like <this>, in the <order> that they are <expected>.");
      Object.getOwnPropertyNames(client.triggers).forEach(function (trigger, index) {
        help.show(client, nick, trigger);
      });
    }
    else {
      help.show(client, nick, command);
    }
  });
}

help.show = function (client, nick, trigger) {
  switch(trigger) {
    case "help":
      client.say(nick, trigger + ": Shows this list of commands.");
      break;
    case "tweet":
      client.say(nick, trigger + ": Sends <tweet>, if a Twitter account is configured.");
      break;
    case "insult":
      client.say(nick, trigger + ": Insults <user> with a random insult.");
      break;
    case "join":
      client.say(nick, trigger + ": Joins <channel>.");
      break;
    case "part":
      client.say(nick, trigger + ": Leaves <channel>.");
      break;
    case "gtfo":
      client.say(nick, trigger + ": Causes kohai to quit.");
      break;
    case "mute":
      client.say(nick, trigger + ": Sets Twitter volume in current channel to 0.");
      break;
    case "unmute":
      client.say(nick, trigger + ": Sets Twitter volume in current channel to 10.");
      break;
    case "kick":
      client.say(nick, trigger + ": If kohai is an op in the channel, kicks <user>.");
      break;
    case "ban":
      client.say(nick, trigger + ": Bans <user>, if kohai is an op.");
      break;
    case "unban":
      client.say(nick, trigger + ": Unbans <user>, if kohai is an op.");
      break;
    case "stfu":
      client.say(nick, trigger + ": Mutes <user>.  Requires kohai to be an op.");
      break;
    case "report":
      client.say(nick, trigger + ": Reports a Twitter username as a spammer.  Please use care.");
      break;
    case "config":
      client.say(nick, trigger + ": Syntax: config <add|rm|set|get|save> <path:to:config:property> <value>");
      break;
    default:
      client.say(nick, trigger + ": No help for this trigger yet, sorry.");
  }
}