var redisModule = require('redis');
var port = process.argv[3];
var host = process.argv[2];

var redisDb = redis.createClient(port, host);

// Aux functions
var monitorQueue = function (queue, callback) {
  'use strict';
  redisDb.llen('wrL:hpri', function (err ,value) {
    callback(value);
  });
};

setInterval(function () {
  monitorQueue(key, function (value) {
    console.log('Elements in queue: ' + value);
  });
}, 500)
