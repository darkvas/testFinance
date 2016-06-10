var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Session = function () {
    'use strict';

    this.register = function (req, res, userId, userType) {
        req.session.loggedIn = true;
        req.session.uId = userId;
        req.session.type = userType;
        res.status(200).send({success: RESPONSE.AUTH.LOG_IN});
    };

    this.kill = function (req, res) {

        if (req.session) {
            req.session.destroy();
        }

        res.status(200).send({success: RESPONSE.AUTH.LOG_OUT});
    };

    this.isAuthenticatedUser = function (req, res, next) {
        var err;

        if (req.session && req.session.uId && req.session.loggedIn) {
            return next();
        }

        err = new Error(RESPONSE.AUTH.UN_AUTHORIZED);
        err.status = 401;
        next(err);
    };

    this.isAdmin = function (req, res, next) {
        var err;

        if (req.session && req.session.type === CONST.USER_ROLE.ADMIN) {
            return next();
        }

        err = new Error(RESPONSE.AUTH.NO_PERMISSIONS);
        err.status = 403;

        next(err);
    };
};

module.exports = Session;
