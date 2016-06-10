'use strict';

var DEST_FILE = 'log.txt';

var logWriter = function () {

    var fs = require('fs');

    function errFunc(destination, errorString) {

        var _error = errorString;

        fs.open(DEST_FILE, 'a', 420, function (err, fileHandle) {

            var res;
            var date;

            if (err) {
                return console.error(err);
            }

            date = new Date();
            res = '-----' + destination + '-----\r\n'
                + date + '\r\n' + _error + '\r\n'
                + '--------------------\r\n';

            fs.write(fileHandle, res, null, 'utf8', function (err, written) {

                if (err) {
                    return console.error(err);
                }

                fs.close(fileHandle);
            });
        });
    }

    function errorHandler(res, callback, errorText) {

        return function (err, result) {

            var stack;
            var errText;

            if (err) {
                errText = errorText || 'Internal server Error';
                stack = err.stack || err;

                res.status(500).send({error: errText});
                return errFunc(stack);
            }

            return callback(result);
        };
    }

    return {
        log         : errFunc,
        errorHandler: errorHandler
    };
};

module.exports = logWriter;
