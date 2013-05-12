/**
 * Start busy checks, call back if the event loop is blocked for more time
 * than it can be tolerated.
 *
 * @param {Object} [opts]
 *   - `tolerance` in ms, default is 100ms
 *   - `interval` in ms, default is 50ms
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
    opts.tolerance || (opts.tolerance = 100);

    // How often to check the state.
    opts.interval || (opts.interval = 50);

    ret.blockedFor = 0;
    ret.state = false;
    ret.stop = function() {
        clearTimeout(timeoutId);
    };

    (function check() {
        ret.blockedFor = Date.now() - start - opts.interval;
        ret.state = ret.blockedFor > opts.tolerance;
        if (callback && ret.state) callback(ret.blockedFor);
        start = Date.now();
        timeoutId = setTimeout(check, opts.interval);
    }());

    return ret;
};
