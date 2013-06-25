var redis = require('redis');
var port = process.argv[3];
var host = process.argv[2];

var redisDb = redis.createClient(port, host);

var monitorQueue = function (queue, callback) {
  'use strict';
  redisDb.llen(queue, function (err ,value) {
    callback(value);
  });
};

var qBefore = 0;

setInterval(function () {
  monitorQueue('wrL:hpri', function (value) {
    console.log('Transactions handled: ' + Math.abs(qBefore - value));
    console.log('Total elements in queue: ' + value);
    qBefore = value;
  });
}, 1000)
