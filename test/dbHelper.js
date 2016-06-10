var config = require('../config/default');
var CONST = require('../constants/index');
var mongoose = require('mongoose');
var async = require('async');
var db;

var DBHelper = function () {
    mongoose.connect(config.dbHost + '/' + config.dbName, config.dbConnectionOptions);
    db = mongoose.connection;

    process.on('SIGINT', function () {
        db.close();
    });

    this.getDB = function () {
        return db;
    };

    this.clearDB = function (cb) {
        var collections = [CONST.MODELS.USER + 's', CONST.MODELS.SESSION + 's'];

        async.each(collections, function (name, eachCb) {
            db.collection(name).deleteMany({}, eachCb);
        }, cb);
    };

    this.disconnect = function () {
        db.close();
    };

    this.connect = function () {
        db = mongoose.connect(config.dbHost + '/' + config.dbName, config.dbConnectionOptions);
    };
};

var dbHelper = new DBHelper();

module.exports = dbHelper;
