# kohai - pluggable irc bot for managing real-time data events

*I am Kohai, semi-useful communications-facilitating pseudointelligence!*


[http://twitter.com/NodeKohai](http://twitter.com/NodeKohai)

##v0.1.0 - Overview

Kohai is a communications-facilitating pseudointelligence (sometimes called a 'bot') used for managing real-time data events.  Kohai makes use of the [Hook.io](http://github.com/hookio/hook.io) framework to separate its I/O concerns and provide for greater extensibility and interoperability with new and different sources of real-time data.

Kohai, out of the box, is a set of four hooks:
  
  - Hook.io-IRC, for IRC connectivity
  - Hook.io-Twitter, for Twitter API access
  - Hook.io-Mailer, for sending support emails
  - Kohai itself, containing the bot's core, IRC command logic, and hook.io event bindings

## Installation

     git clone git://github.com/nodejitsu/kohai.git
     cd kohai
     npm install
     node bin/kohai
     

`kohai` will now start up and connect to its default channels on irc.freenode.net.

## Got Ideas? Got Issues?

Check out our [Issue Tracker](https://github.com/nodejitsu/kohai/issues), we have a lot of open issues being worked on. Feel free to add feature requests as well.

## Configuration

All `kohai` configuration settings are stored in a `config.json` file. `kohai` ships with a `config.json` file that contains the proper structure and default values for `kohai`'s configuration.  The IRC connection data provided by default is valid, but the Twitter and Bit.ly credentials provided are not.  If these services are desired, valid credentials will need to be obtained before they are used.  HTTP 401 errors being returned from the Twitter API are an indication of bad credentials.

While kohai is running, users with administrative access may send private messages to kohai to alter configuration data on the fly.  This is described in more detail [below](#config)

Please note that unlike most `kohai` commands, the !config command is only available when messaging `kohai` directly, rather than when sending a message to a channel `kohai` is in.

## Setting up Twitter

By default, the `config.json` will not contain any Twitter API keys. You'll need to setup:

`auth.twitter.consumer_key`

`auth.twitter.consumer_secret`

`auth.twitter.access_token_key`

`auth.twitter.access_token_secret`

[Here is a link with further information on getting these keys from Twitter](https://dev.twitter.com/apps/new)

### Tracking keywords on Twitter

`track` - array of keywords to search for on Twitter

    "track" : [
      "#nodejs", "node.js", "@nodejitsu", "@nodekohai", "nodejitsu", "#nodejitsu", "#nodeconf", "#jsconf", "dnode"
    ]

The Twitter Streaming API can take a variety of parameters, including specific user IDs to follow and bounded location boxes for tracking tweets from specific geographic areas.  Please see Twitter's extensive API documentation for more information.

###Dynamic Twitter Rate-Limiting

`kohai` has been designed to get its Twitter feed out of the way when an active conversation starts up in a joined channel, and keeps a rolling average of messages per second to achieve this.  

In addition to the rate-limiting, `kohai` also implements a Levenshtein-based similar tweet filter - each new incoming tweet is checked against recent tweets, and any tweet closer than the filter distance will be suppressed.  This means a big reduction in spam from retweets and bots!  The exact filtering level can be adjusted:

     !config set twitFilter <number>

The default is 25; values between 10 and 40 are recommended for ordinary spam filtering purposes.  

## Simple role-based access control

Kohai's configuration file contains an object called `access` with three arrays: `admin`, `employee`, and `friend`.  These are the three possible levels of access, in descending order.  On an incoming IRC message, the user's nickname (and, optionally, their ident status with nickserv) is checked against these lists - without matching a name from the proper access level, the trigger command will not be executed.

### Adding Users to the whitelist by IRC handle

While `kohai` is running, an administrator can add any desired user to any level of the whitelist.

     !config add access:admin AvianFlu
     !config add access:employee leetcoder5

<a name="config"></a>
### Notable Administrator IRC Triggers  

     /msg kohai !config <add|rm|set|get|save> <path:in:config> <value to set or add>
     
Allows for alteration of `kohai`'s configuration data on the fly.  Due to the verbosity of many responses, configuration is conducted via private messages to `kohai`.  Options will take effect immediately, but `config save` is required to persist `kohai`'s settings to disk.  For example:

     !config add access:friend someguy
     !config get access:friend
     !config save
     
Would add "someguy" to the admin whitelist, show the whitelist to the user the command came from, and save the new config to disk.

     !op/!deop/!voice/!devoice/!ban/!unban <user>

Perform the associated IRC action - again, `kohai` must be an op.  Please note that `!ban` also kicks the banned user. 

     !join/!part <channel>
     
Joins or leaves the specified IRC channel.  

     !gtfo

Tells `kohai` to shutdown

### Employee-level commands

     !kick <user>

Kicks the specified user from the current channel.

     !stfu <user> <mute length in seconds>

Temporarily mutes a user (IRC mode +q).  Requires `kohai` to be an op in the specified channel.

### Friend-level commands

     !tweet <message>

Tweets message from configured Twitter account

     !insult <user>

Insults a user with one of several random insults

### Commands with no access control

     !help
     
Displays a list of available help topics.  

## Extending Kohai

### Adding commands

Every time `kohai` starts, `lib/plugins` will be read, and `require()` will be called on every `.js` file found there.  To add a command that only exports one function:

      var mycommand = module.exports = function (data, command) {
        if (!data.friend) {
          // Check if the message came from a user with a proper access level.
          return false;
        }
        // From here, all properties of the kohai object can be accessed.
        this.emit('sendMsg', { dest: data.to, msg: 'Hi everybody!' });
      }

If you'd rather export multiple commands from the same file, this is supported as well - but note that the command will be `!methodName`, rather than the name of the file/object.

If multiple methods of the same name are attempted to be loaded as commands, only the first will be loaded.  If the file in question throws when it is required, it will similarly be skipped.

### Adding event listeners for other Hook.io hooks

Kohai will also read all the `.js` files in `lib/listeners` on startup - rather than loading the functions to be run in the future, however, they will just be run once on startup to add the event listeners in question.

      var init = module.exports = function () {
        var self = this;
        self.on('*::eventName', function (data, callback) {
          // Do something with data
          return callback(null); // This is an over-the-wire callback.
        }); 
      }

Once again, access to the main `kohai` object is preserved, and if multiple methods are exported, each method will be run.

##Contributors: 

### Charles McConnell, Marak Squires, Bradley Meck, Jacob Chapel, samsonjs, slickplaid, micrypt, and others 