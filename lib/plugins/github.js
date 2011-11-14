/*
 *
 * plugins/github.js - IRC commands for GitHub interaction.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */
 
 
module['exports'] = function (kohai) {

  //
  // Listen for kohai events to send to twitter
  //
  kohai.on('**::kohai::gh', function(data, cb){

    if (typeof data !== 'object') {
      data = {
        msg: data
      };
    }


    if(data.nick){
      data.msg = data.nick + ': , ' + data.msg;
    }
    
    console.log('gh request', data);
    
    
    var user    = /([\w\.\-]+)/,
        project = /([\w\.\-]+)\/([\w\.\-]+)/,
        issue   = /([\w\.\-]+)\/([\w\.\-]+)#(\d+)/,
        SHA     = /([\w\.\-]+)\/([\w\.\-]+)@([a-fA-F0-9]+)/,
        result;

    if (result = issue.exec(data.msg)) {
      data = {
        to: data.to,
        msg: 'https://github.com/' + result[1] + '/' + result[2] + '/issues/' + result[3]
      }
      return kohai.emit('out', data);
    }

    if (result = SHA.exec(data.msg)) {
      data = {
        dest: data.to,
        msg: data.nick + ', https://github.com/' + result[1] + '/' + result[2] +
           '/commit/' + result[3]
      };
      return kohai.emit('out', data);
    }

    if (result = project.exec(data.msg)) {
      console.log('project');
      data = {
        to: data.to,
        msg: 'https://github.com/' + result[1] + '/' + result[2]
      }
      return cb(null, data);
    }

    if (result = user.exec(data.msg)) {
      data = {
        dest: data.to,
        msg: data.nick + ', https://github.com/' + result[1]
      };
      return kohai.emit('out', data);
    }

  });

};


return;

gh.gh = function (data, command) {
  if (!data) {
    return;
  }

};

