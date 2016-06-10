var CONST = require('../constants');
var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    sessionId: String
}, {
    collection: CONST.MODELS.SESSION + 's'
});

module.exports = mongoose.model(CONST.MODELS.SESSION, sessionSchema);
