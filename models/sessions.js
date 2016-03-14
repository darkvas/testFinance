var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');

    var session = new mongoose.Schema({
        sessionId: String
    }, {
        collection: CONST.MODELS.SESSION + 's'
    });

    db.model(CONST.MODELS.SESSION, session);
};
