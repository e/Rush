var fs = require('fs');

var pid = process.argv[2];

// Functions to get system usage
var getUserUsage = function (pid) {
  'use strict';
  var data = fs.readFileSync('/proc/' + pid + '/stat');

  var elems = data.toString().split(' ');
  var utime = parseInt(elems[13]);
  var stime = parseInt(elems[14]);

  return utime + stime;
}

var getSysUsage = function () {
  'use strict';
  var data = fs.readFileSync('/proc/stat');

  var elems = data.toString().split(' ');

  return parseInt(elems[2]) + parseInt(elems[3]) + parseInt(elems[4]) + parseInt(elems[5]);
};

var getProcMem = function (pid) {
  'use strict';
  var data = fs.readFileSync('/proc/' + pid + '/status');

  var elems = data.toString().split('\n');
  elems = elems[15].split('\t');
  elems = elems[1].split(' ');

  return elems[elems.length - 2];
};

// Functions to monitor a pid
var monitor = function (pid) {
  'use strict';
  var startTimeU,
      startTimeS,
      endTimeU,
      endTimeS,
      mem;

    startTimeU = getUserUsage(pid);
    startTimeS = getSysUsage();

  setTimeout(function (startTimeU, startTimeS) {
    var cpuSys, cpuUser, percentage = 0, mem = 0;

      endTimeU = getUserUsage(pid);
      endTimeS = getSysUsage();

      console.log(endTimeS - startTimeS);
      cpuSys = endTimeS - startTimeS;
      cpuUser = endTimeU - startTimeU;

      mem += parseInt(getProcMem(pid));
      percentage += 100 * (cpuUser / cpuSys);

    /*var result = {
      memory:mem,
      cpu:percentage
    };

    callback(result);*/
    console.log('------------------------------------------------------------------------');
    console.log('CPU: ' + percentage + '%');
    console.log('Memory:'  + mem + ' bytes');
    console.log('------------------------------------------------------------------------');

  }.bind({}, startTimeU, startTimeS), 1000);
};
º
setInterval(function () {
  monitor(pid);
}, 1000);
