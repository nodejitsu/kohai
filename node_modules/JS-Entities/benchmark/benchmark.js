var bench = require("./bench.js")
//Niave Impl
function naive(html){
    return String(html)
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
ours = require("./index.js").xml.encode

//Our Impl
bench.compare({
  "naive small" : function () {
    naive("<test fake=\"true\">Marlee & Me</this>")
  },
  "ours small" : function () {
    ours("<test fake=\"true\">Marlee & Me</this>")
  },
  "naive large" : function () {
    naive("<test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this>")
  },
  "ours large" : function () {
    ours("<test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this><test fake=\"true\">Marlee & Me</this>")
  }
},null,null,null,function(err,ret){
	console.log(require("sys").inspect(ret,null))
});
