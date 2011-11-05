var insults = {};

insults = exports;


insults.commands = {
  
  "insult" : function (target, kohai) {
    //if (!data[this.ranks[2]]) { return false; }
    console.log(arguments);
    var n = Math.floor(Math.random() * insultList.length);
    //msg.slice(1).join(' ').replace(/[^\w\d\s]/g, '') ||
    kohai.emit('output', { msg : insultList[n].replace('%%', target) }) 
  }
  
};

var insultList = [
  "%% is a wombat-loving heifer-puncher!",
  "%% is an unsightly trouser stain!",
  "%% is a venomous lily-licker!",
  "%% smells of elderberry wine!",
  "%% is like one of those callbacks that just won't fire.",
  "I slap thee verily with a trout quite large, %%!",
  "%% actually looks rather nice today."
];