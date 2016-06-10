var CONST = require('../constants');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
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

module.exports = mongoose.model(CONST.MODELS.USER, userSchema);
