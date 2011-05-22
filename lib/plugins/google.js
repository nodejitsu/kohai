var exec = require('child_process').exec;

module.exports = function(config) {
  // Google search function thanks to Gianni Chiappetta (github.com/gf3)
  // Original source @ https://github.com/gf3/protobot/blob/master/vendor/google/google.js
  this.google = function(query, cb) {
    exec("curl 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=" + escape(query) + "'", 
      function (err, stdout, stderr) {
        var results = JSON.parse(stdout)['responseData']['results'];
        results.forEach(function(x) {
          x.titleNoFormatting = x.titleNoFormatting.replace(/&#([^\s]*);/g, function(m1, m2) {
            return String.fromCharCode(m2);
          }).replace(/&(nbsp|amp|quot|lt|gt);/g, function(m1, m2) {
            return { 'nbsp': ' ', 'amp': '&', 'quot': '"', 'lt': '<', 'gt': '>' }[m2];
          });
          return x;
        });
        cb.call(this, results);
      });
  }
}