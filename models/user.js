var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');

    var user = new mongoose.Schema({
        email       : {type: String, unique: true, index: true},
        pass        : {type: String},
        userRole    : {type: String},
        createdAt   : {type: Date, default: Date.now, index: true},
        confirmToken: {type: String},
        profile     : {
            firstName: {type: String},
            lastName : {type: String},
            birthDay : {type: Date}
        }
    }, {
        collection: CONST.MODELS.USER + 's'
    });

    db.model(CONST.MODELS.USER, user);
};
