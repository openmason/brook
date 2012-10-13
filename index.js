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

  socket.connect(port);
  console.log('publisher connected to ' + port);

  // lets count messages / sec
  var totalMessages=0;
  setInterval(function() {
    console.log('total messages sent = '+totalMessages);
    totalMessages=0;
    // now fire messages
    for(var i=0;i<5000;i++) {
      var value = Math.random()*1000;
      socket.send('log ' + value);
      totalMessages++;
    }
  }, 1000);

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

// create a forwarder device
function forwarder(frontPort, backPort) {
  var frontSocket = zeromq.socket('sub'),
      backSocket = zeromq.socket('pub');

  frontSocket.identity = 'sub' + process.pid;
  backSocket.identity = 'pub' + process.pid;

  frontSocket.subscribe('');
  frontSocket.bind(frontPort, function (err) {
    console.log('bound', frontPort);
  });
    
  var totalMessages=0;
  frontSocket.on('message', function() {
    //pass to back
    //console.log('forwarder: recasting', arguments[0].toString());
    backSocket.send(Array.prototype.slice.call(arguments));
    totalMessages++;
  });

  backSocket.bind(backPort, function (err) {
    console.log('bound', backPort);
  });

  // lets count messages forwarded
  setInterval(function() {
    console.log('messages forwarded = ' + totalMessages);
    totalMessages=0;
  }, 1000);

}

var launch='none';
// node index.js [pub|sub]
if(process.argv.length>2) {
  launch = process.argv[2];
}
var pubport = 'tcp://127.0.0.1:12345';
var subport = 'tcp://127.0.0.1:12346';
if(launch=='pub') {
  publisher(pubport);
} else if(launch=='sub') {
  subscriber(subport);
} else {
  forwarder(pubport, subport);
}
