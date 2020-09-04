// http module
const http = require('http');
const fs = require('fs');
const scdl = require('soundcloud-downloader');

// the function inside 'createServer' gets executed whenever
// a request is received on the specified port
http.createServer(function (req, res) {
  /*res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write('hi again');*/
  fs.readFile('page.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
  //res.end();
}).listen(80);

function test() {
  console.log("This works!");
}
