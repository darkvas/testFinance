var SessionHandler = require('./sessions');
var CONST = require('../constants');
var RESPONSE = require('../constants/response');

/* var CashHandler = function(db) {*/

/* var mongoose = require('mongoose');
 var session = new SessionHandler(db);
 var async = require('async');
 var User = db.model(CONST.MODELS.USER);
 var crypto = require('crypto');*/

var Cash = function (value, curr) {
    this.value = value;
    this.currency = curr;
    this.createdAt = new Date();
};

Cash.prototype.inCurr = function (koef) {
    return this.value * koef;
};

Cash.prototype.toString = function () {
    return this.value + ' ' + this.currency + ' - at ' + this.createdAt.toString();
};

// module.exports = CashHandler;
