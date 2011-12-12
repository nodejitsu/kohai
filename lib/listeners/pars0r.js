var select = require('soupselect').select,
    htmlparser = require("htmlparser"),
    http = require('http'),
    util = require('util');

// fetch some HTML...
var http = require('http');
var host = 'www.us1.darkfallonline.com';
var client = http.createClient(80, host);
var request = client.request('GET', '/news/',{'host': host});

request.on('response', function (response) {
    response.setEncoding('utf8');

    var body = "";
    response.on('data', function (chunk) {
        body = body + chunk;
    });

    response.on('end', function() {

        // now we have the whole body, parse it and select the nodes we want...
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                util.debug("Error: " + err);
            } else {

                // soupselect happening here...
                var accesslvl = select(dom, 'img');
                  if(accesslvl.indexOf("players_online" !=-1)) {
                    util.puts("US1: Online for players");
                  }
                  else {
                    util.puts("US1: Offline for players");
                 }

            }
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
    });
});
request.end();
