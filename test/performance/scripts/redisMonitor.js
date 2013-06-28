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
var rateBefore = 0;
var rate = 0;
var acceleration = 0;

setInterval(function () {
  'use strict';
  monitorQueue('wrL:hpri', function (value) {
    rate = value - qBefore;
    acceleration = rate - rateBefore;
    console.log('------------------------------------------------------------------------');
    console.log('Transactions handled: ' + rate);
    console.log('Acceleration: ' + acceleration);
    console.log('Total elements in queue: ' + value);
    console.log('------------------------------------------------------------------------');
    qBefore = value;
    rateBefore = rate;
  });
}, 500);
