//Copyright 2012 Telefonica Investigación y Desarrollo, S.A.U
//
//This file is part of RUSH.
//
//  RUSH is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//  RUSH is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License along with RUSH
//  . If not, seehttp://www.gnu.org/licenses/.
//
//For those usages not covered by the GNU Affero General Public License please contact with::dtc_support@tid.es

var MG = require('./myGlobals').C;
var db = require('./dbRelayer');
var config_global = require('./configBase.js');

var path = require('path');
var log = require('PDITCLogger');
var logger = log.newLogger();
logger.prefix = path.basename(module.filename, '.js');


function init(emitter) {
  'use strict';

  logger.debug({ opType: 'INIT EV PERSISTENCE', msg: 'Arguments: '}, [ emitter ]);

  return function(callback) {
    emitter.on(MG.EVENT_NEWSTATE, function onNewEvent(data) {
      if (data.state === MG.STATE_ERROR || data.state === MG.STATE_COMPLETED) {
        var type = data.state === MG.STATE_ERROR ?
            'ERROR' : data.task.headers[MG.HEAD_RELAYER_PERSISTENCE];
        doPersistence(data.task, data.result || data.err,
            type, function(error, result) {
              if (error || result) {
                var st = {
                  id: data.task.id,
                  traceID: data.task.traceID,
                  state: MG.STATE_PERSISTENCE,
                  date: new Date(),
                  task: data.task,
                  err: error,
                  result: result
                };
                emitter.emit(MG.EVENT_NEWSTATE, st);
              }
            });
      }
    });
    callback(null, 'ev_persistence OK');
  };
}
function doPersistence(task, respObj, type, callback) {
  'use strict';
  if (type === 'BODY' || type === 'STATUS' ||
      type === 'HEADER' || type === 'ERROR') {
    task.traceID = task.traceID;
    setObject(task, respObj, type, callback);
  } else {
    var traceID = task.traceID;
    if (! type && callback) {
      callback(null, null);
    } else {
      if (callback) {
        //Error
        var errMsg =
            type + ' is not a valid value for ' + MG.HEAD_RELAYER_PERSISTENCE;
        logger.warning({ opType: 'PERSISTENCE', msg: 'Error', userID: task.user, traceID: traceID },
            { id: task.id, error: errMsg });
        callback(errMsg);
      }
    }
  }
}


function setObject(task, respObj, type, callback) {
  'use strict';
  //remove from response what is not needed
  var errMsg,
    traceID = task.traceID,
    setObj = {};
  type = type.toUpperCase();

  setObj = copyObj(respObj);
  switch (type) {
    case 'STATUS':
      delete setObj.headers;
    /* fall-through */
    case 'HEADER':
      delete setObj.body;
      delete setObj.encoding;
      break;
  }

  db.update(task.id, setObj, traceID, task.user, function onUpdated(err) {

    if (err) {
      logger.warning({ opType: 'PERSISTENCE', msg: 'Redis Update Error', userID: task.user, traceID: traceID },
          { id: task.id, error: err });
    } else {
      logger.info({ opType: 'PERSISTENCE', msg: 'Completed', userID: task.user, traceID: traceID },  { id: task.id });
    }

    if (callback) {
      callback(err, setObj);
    }
  });
}

function copyObj(obj) {

  var copy = {};

  for (var attr in obj) {
    copy[attr] = obj[attr];
  }

  return copy;
}

exports.init = init;

//require('./hookLogger.js').init(exports, logger);
