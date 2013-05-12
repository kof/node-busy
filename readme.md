## Detect if event loop is busy.

The idea is not new, implementation probably too. I just saw this https://github.com/lloyd/node-toobusy and found it useful. This projects does pretty the same but in pure javascript.

## Things you can do

- Log how busy is the loop
- Stop accepting new tasks
- Warn yourself
- Scale up the app

## Example (shameless copied from toobusy)

    var busy = require('busy'),
        express = require('express');

    var app = express();

    var busyCheck = busy(function(amount) {
        console.log('Loop was busy for', amount, 'ms');
    });

    // middleware which blocks requests when we're too busy
    app.use(function(req, res, next) {
        if (busyCheck.blocked) {
            res.send(503, "I'm busy right now, sorry.");
        } else {
            next();
        }
    });

    app.get('/', function(req, res) {
        // processing the request requires some work!
        var i = 0;
        while (i < 1e5) i++;
        res.send("I counted to " + i);
    });

    var server = app.listen(3000);

    process.on('SIGINT', function() {
        server.close();
        // calling .stop allows your process to exit normally
        busyCheck.stop();
        process.exit();
    });

## Api `busy([options], [callback])`

Optional options:

    - `max` max time in ms alowed to be busy, default is 100ms
    - `interval` how often to check the state in ms, default is 50ms

Optional callback is called every time the event loop was busy for longer amount of time than defined in `max`. Passed value is amount of ms the loop was blocked for.


    var busyCheck = busy();

    busyCheck.blocked; // Is true if by the last check, max was exceeded
    busyCheck.blockedFor; // Number in ms the loop was blocked for, during the last check

    busyCheck.stop(); // Stop doing checks
