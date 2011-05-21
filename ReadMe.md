# kohai - pluggable irc bot for managing real-time data events

*I am Kohai, semi-useful communications-facilitating pseudointelligence!*

##v0.0.1 - Experimental

Due to the high volume of requests in the #Node.js and #nodejitsu IRC rooms on irc.freenode.net, we've open-sourced this library. 

kohai is **EXPERIMENTAL SOFTWARE** and has **NO UNIT TESTS**.


At Nodejitsu we try to maintain a high level of quality across all of our open-source projects. This particularl project is not suitable for public use yet. We've released it early because we've gotten a lot of requests from eager developers who want to start hacking in more features.

We look forward to seeing your patches and continuing to improve this library.

# Installation

     git clone git://github.com/nodejitsu/kohai.git
     cd kohai
     node bin/server
     

kohai will now start up and connect to its default channels on irc.freenode.net. Please note that the included configuration file will not successfully connect to Twitter - the Twitter API requires that apps register before using the API, which can be accomplished at http://dev.twitter.com.


# Configuration 

The config.json file in kohai's root directory contains all currently implemented configuration options - a fresh git clone will at least need to edit the bot's name, auth.twitter and auth.irc fields in order to connect properly and achieve full IRC and Twitter functionality.  

config.plugins.twitter.track is an array of all the terms you want to search twitter for - there is code in place to reduce, if not eliminate, retweet spam in chat.  Please note that the Twitter API will not return #topic tweets if only 'topic' is specified in the tracking list - in other words, both '#topic' and 'topic' would need to be in your tracking list in order to see tweets that contained both.  

We have included a whitelist in config.json so that the triggers in ./lib/plugins/alias.js - largely sensitive commands - are only available to a list of pre-approved users.  

config.plugins.irc is a set of IRC-specific options.  Note that mute_timer is in *seconds*.  command_string sets the bot's command string - at present the string is put straight into a new RegExp() object, so a space is \\s, etc.  The op, voice, and ban lists are checked when users join any channel that kohai is in, but the commands will only work if kohai has been made a channel op.  

config.modules is the list of modules to load - the only steps necessary to load a new module are to add its name here and to add the actual module to ./lib/plugins - black-belt nodejitsu automagic handles the rest.  