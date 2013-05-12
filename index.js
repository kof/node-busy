/**
 * Start busy checks, call back if the event loop is blocked for more time
 * than defined in `max`.
 *
 * @param {Object} [opts]
 *   - `max` max time in ms alowed to be busy, default is 100ms
 *   - `interval` how often to check in ms, default is 50ms
 * @param {Function} [callback]
 * @return {Object}
 */
module.exports = function(opts, callback) {
    var timeoutId,
        ret = {},
        start = Date.now();

    if (typeof opts == 'function')   {
        callback = opts;
        opts = null;
    }

    opts || (opts = {});

    // If something is blocking the loop for less than this amount of ms than its ok.
    opts.max || (opts.max = 100);

    // How often to check the state.
    opts.interval || (opts.interval = 50);

    ret.blockedFor = 0;
    ret.blocked = false;
    ret.stop = function() {
        clearTimeout(timeoutId);
    };

    (function check() {
        ret.blockedFor = Date.now() - start - opts.interval;
        ret.blocked = ret.blockedFor > opts.max;
        if (callback && ret.blocked) callback(ret.blockedFor);
        start = Date.now();
        timeoutId = setTimeout(check, opts.interval);
    }());

    return ret;
};

