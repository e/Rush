var redisModule = require('redis');
var config = require('./config'); // here goes the file containing redis adress

var redisDb = redis.http.createClient(config.port, config.host);

// Aux functions
var monitorQueue = function (queue, callback) {
  'use strict';
  redisDb.llen(queue, function (err ,value) {
    callback(value);
  });
};
