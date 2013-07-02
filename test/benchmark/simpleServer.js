var http = require('http');

var requests = 0;

var srv = http.createServer(function (req, res) {
  'use strict';
  requests++;

  req.on('end', function() {
    setTimeout(function() {
      res.writeHead(201, {'Content-Type': 'text/plain'});
      res.end('okay');
    }, 2 * 1000);
  });
});

setInterval(function () {
  console.log('Req: ' + requests);
  if (requests != 0) {
    requests = 0;
  }
}, 1000);

srv.listen(7575);
