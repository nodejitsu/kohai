var translate = require("../../../translate.js")
var html = require("JS-Entities").html
module.exports = function(config) {
  //!translate lang:lang text
  this.triggers.translate = function(name,to,message,languages,text) {
    //figure out who to respond to
    //if it was a private message to me, respond to the person
    //if it was to a room and not me specificall, reply in the room
    var destination = to === this.nick
      ? name
      : to
    
    var client = this
    if(text) {
      var pair = languages.split(/[:]/)

      translate.text({input:pair[0],output:pair[1]},text,function(txt) {
        //respond with the translated test, decoding the html entities
        client.say(destination,html.decode(txt))
      })
    }
    else {
      translate.text(languages,function(txt) {
        //respond with the translated test, decoding the html entities
        client.say(destination,html.decode(txt))
      })  
    }
  } 
  var client = this, languages;
  client.translate = function(text, cb) {
    translate.detect(text, function(err, data) {
      // If language isn't english, then translate
      if (data.language !== 'en') {
        // Find any twitter @users or #hashes and save them
        // so translate doesn't add spaces like @ users and # hashes
        var users, hashes;
        users = text.match(/@(\w+)/g);
        hashes = text.match(/#(\w+)/g);
        if (Array.isArray(users)) {
          users.forEach(function(user, i) {
              text = text.replace(user, '{u' + i + '}');
          });
        }
        if (Array.isArray(hashes)) {
          hashes.forEach(function(hash, i) {
              text = text.replace(hash, '{h' + i + '}');
          });
        }
        translate.text({input: languages[data.language], output: 'English'}, text, function(err, txt) {
          // Replace the placeholders with the original @users and #hashes
          if (Array.isArray(users)) {
            users.forEach(function(user, i) {
                txt = txt.replace('{U'+i+'}', user);
                txt = txt.replace('{u'+i+'}', user);
            });
          }
          if (Array.isArray(hashes)) {
            hashes.forEach(function(hash, i) {
              txt = txt.replace('{H'+i+'}', hash);
                txt = txt.replace('{h'+i+'}', hash);
            });
          }
          // Common character in asian languages that doesn't get replaced
          txt = txt.replace('&#39;', '\'');
          cb(html.decode(txt) + ' | Language: '+languages[data.language]);
        })
      } else {
        cb(text);
      }
    })
  }
  // Reverse of languages, so translate.js gets the proper language for input
  // and also for showing the full name of the language when translated
  languages = {
    "af": "Afrikaans",
    "sq": "Albanian",
    "ar": "Arabic",
    "hy": "Armenian ALPHA",
    "az": "Azerbaijani ALPHA",
    "eu": "Basque ALPHA",
    "be": "Belarusian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "et": "Estonian",
    "tl": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "gl": "Galician",
    "ka": "Georgian ALPHA",
    "de": "German",
    "el": "Greek",
    "ht": "Haitian Creole ALPHA",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hu": "Hungarian",
    "is": "Icelandic",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "mk": "Macedonian",
    "ms": "Malay",
    "mt": "Maltese",
    "no": "Norwegian",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "sr": "Serbian",
    "sk": "Slovak",
    "sl": "Slovenian",
    "es": "Spanish",
    "sw": "Swahili",
    "sv": "Swedish",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu ALPHA",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "yi": "Yiddish"
  }
}
