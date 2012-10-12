/**
 * brook - main file
 * MIT Licensed.
 */

var os = require("os");

console.log(os.hostname());
/*
console.log(os.uptime(), os.loadavg(), os.freemem(), os.totalmem(), os.cpus());
console.log('---------');
console.log(os.type(),os.release(), os.arch(), os.platform());
console.log('---------');
console.log(os.networkInterfaces());
*/

var cluster = require('cluster'),
    zeromq = require('zmq');

cluster.on('death', function(p) {
  console.log('process ' + p.pid + ' died');
});

// lets do the publisher here
function publisher(port) {
  var socket = zeromq.socket('pub');
  socket.identity = 'pub' + process.pid;

  socket.bind(port, function(err) {
    if (err) throw err;
    console.log('publish bound to ' + port);
    // lets count messages / sec
    var totalMessages=0;
    setInterval(function() {
      console.log('total messages sent = '+totalMessages);
      totalMessages=0;
    }, 1000);
    // now fire messages
    for(var i=0;i<1;) {
      var value = Math.random()*1000;
      socket.send('log ' + value);
      totalMessages++;
    }
  });
}

// lets do the subscriber here
function subscriber(port) {
  var socket = zeromq.socket('sub');
  socket.identity = 'sub' + process.pid;

  // have to subscribe, otherwise nothing would show up
  // subscribe to everything
  socket.subscribe('');

  var totalMessages=0;

  // receive messages
  socket.on('message', function(data) {
    //console.log(socket.identity + ': received data ' + data.toString());
    totalMessages++;
  });

  socket.connect(port); 
  console.log('connected to ' + port);

  // lets count messages recvd
  setInterval(function() {
    console.log('messages received = ' + totalMessages);
    totalMessages=0;
  }, 1000);

}

var launch='pub';
// node index.js [pub|sub]
if(process.argv.length>2) {
  launch = process.argv[2];
}
var zmqport = 'tcp://127.0.0.1:12345';
if(launch=='pub') {
  publisher(zmqport);
} else {
  subscriber(zmqport);
}
