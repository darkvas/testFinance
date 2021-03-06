var SessionHandler = require('../handlers/sessions');

module.exports = function (app) {
    'use strict';

    var usersRouter = require('./users');

    var session = new SessionHandler();

    app.get('/', function (req, res) {
        res.status(200).send('Express have started successfully');
    });

    app.use('/user', usersRouter);

    function notFound(req, res, next) {
        var err = new Error('Not found');
        err.status = 404;
        next(err);
    }

    function errorHandler(err, req, res, next) {
        var status = err.status || 500;

        if (process.env.NODE_ENV === 'production') {
            res.status(status).send(err.message);
        } else {
            res.status(status).send(err.message + '\n' + err.stack);
        }

        if (status === 401) {
            console.warn(err.message);
        } else {
            console.error(err.message);
            console.error(err.stack);
        }
    }

    app.use(notFound);
    app.use(errorHandler);
};
