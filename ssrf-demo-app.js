//////////////////////////////////////////
// SSRF Demo App
// Node.js Application Vulnerable to SSRF
// Written by Seth Art <sethsec@gmail.com>
// MIT Licensed
//////////////////////////////////////////

var http = require('http');
var needle = require('needle');
var express = require('express');
var app = express();
var commandLineArgs = require('command-line-args');

// Currently this app is also vulnerable to reflective XSS as well. Kind of an easter egg :)

var cli = [
  { name: 'port', alias: 'p', type: Number, defaultOption:80 }
]
var options = commandLineArgs(cli)
var color   = 'Red'

app.get('/', function(request, response){
    var params = request.params;
    if (request.query['mime'] == 'plain'){
      var mime = 'plain';
        } else {
      var mime = 'html';
        };
    if (request.query['url'] ){ 
    	var url = request.query['url'];
    } else {
        response.writeHead(200, {'Content-Type': 'text/'+mime});
        response.write('<h1><span style="color:'+color+'">Fortinet</span> - Nodejs SSRF vulnerable</h1><p></p><hr/>\n');
        response.write('<h3>Exploit SSRF: specify the url parameter, I\'ll request the page for you:</h2><br><br>\n');
        response.write('<h3>Example: http://IP:PORT/?url=https://ifconfig.me</h2><br><br>\n');
	      response.end();
    }

    console.log('New request: '+request.url);

    needle.get(url, { timeout: 3000 }, function(error, response1) {
      if (!error && response1.statusCode == 200) {
        response.writeHead(200, {'Content-Type': 'text/'+mime});
        response.write('<h1><span style="color:'+color+'">Fortinet</span> - Nodejs SSRF vulnerable</h1><p></p><hr/>\n');
        response.write('<h3>Exploit SSRF: well done, I requested: <font color="red">'+url+'</font> for you\n</h2><br><br>\n');
        console.log(response1.body);
        response.write(response1.body);
        response.end();
      } else {
        response.writeHead(404, {'Content-Type': 'text/'+mime});
        response.write('<h1><span style="color:'+color+'">Fortinet</span> - Nodejs SSRF vulnerable</h1><p></p><hr/>\n');
        response.write('<h3>Exploit SSRF: well done but I could not find: <font color="red">'+url+'</font> for you\n</h2><br><br>\n');
        response.end();
        console.log('error')
      }
    });
})
if (options.port) {
	var port = options.port
} else {
	var port = 80
}

app.listen(port);
console.log('\n##################################################')
console.log('#\n#  Server listening for connections on port:'+port);
console.log('#  Connect to server using the following url: \n#  -- http://[server]:'+port+'/?url=[SSRF URL]')
console.log('#\n##################################################')
