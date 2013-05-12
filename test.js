var busy = require('./'),
    program = require('commander');

busy(function(blockedFor) {
    console.log('Loop was busy for', blockedFor, 'ms');
});

function block(amount) {
    var until = Date.now() + amount * 1000;

    while (Date.now() < until);
}

(function prompt() {
    program.prompt('Type amount of seconds to block event loop for:', function(amount) {
        if (isNaN(amount)) {
            return prompt();
        }
        amount = Number(amount);

        console.log('Blocking the loop for', amount, 'seconds...');
        block(amount);
        prompt();
    })
}());
