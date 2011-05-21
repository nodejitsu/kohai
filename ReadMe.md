

# kohai - pluggable irc bot for managing real-time data events

*I am Kohai, semi-useful communications-facilitating pseudointelligence!*

[http://twitter.com/NodeKohai](http://twitter.com/NodeKohai)

##v0.0.1 - Experimental

Due to the high volume of requests in the #Node.js and #nodejitsu IRC rooms on irc.freenode.net, we've open-sourced this library. 

kohai is **EXPERIMENTAL SOFTWARE** and has **NO UNIT TESTS**.


At Nodejitsu we try to maintain a high level of quality across all of our open-source projects. This particular project is not suitable for public use yet. We've released it early because we've gotten a lot of requests from eager developers who want to start hacking in more features.

We look forward to seeing your patches and continuing to improve this library.

# Installation

     git clone git://github.com/nodejitsu/kohai.git
     cd kohai
     node bin/kohai
     

kohai will now start up and connect to its default channels on irc.freenode.net.

# Configuration

All `kohai` configuration settings are stored in the `config.json` file. 

## Setting up Twitter

By default, the `config.json` will not contain any Twitter API keys. You'll need to setup:

`config.auth.twitter.consumer_key`

`config.auth.twitter.consumer_secret`

`config.auth.twitter.access_token_key`

`config.auth.twitter.access_token_secret`

[Here is a link with further information on getting these keys from Twitter](https://dev.twitter.com/apps/new)

## Tracking keywords on Twitter

`config.plugins.twitter.track` - array of keywords to search for on Twitter

    "track" : [
      "#nodejs", "node.js", "@maraksquires", "@nodejitsu", "@nodekohai", "nodejitsu", "#nodejitsu", "marak squires", "#nodeconf", "#jsconf", "dnode", "nconf"
    ]

## Adding Admin users to the whitelist by IRC handle

`config.plugins.alias.whitelist` - array of IRC users with Operator privileges

    "alias" : {
      "whitelist" : [ "AvianFlu", "Marak", "hij1nx", "indexzero", "DTrejo", "tmpvar", "ryah", "dominictarr" ]
    }

## Notable Administrator IRC Triggers

     !tweet <message>

Tweets message from configured Twitter account

     !insult <user>

Insults a user

     !gtfo

Tells kohai to shutdown


##Contributors: 

###Bradley Meck, Charles McConnell, Marak Squires