'use strict';

var CONST = require('../../constants/index');
var mongoose = require('mongoose');
var async = require('async');

var PreparingDb = function () {
    var crypto = require('crypto');
    var connectOptions = {
        db    : {native_parser: false},
        server: {poolSize: 5},
        user  : process.env.DB_USER,
        pass  : process.env.DB_PASS,
        w     : 1,
        j     : true,
        mongos: true
    };

    var dbConnection = mongoose.createConnection(process.env.DB_HOST, process.env.DB_NAME, process.env.DB_PORT, connectOptions);
    var models = require('../../models/index')(dbConnection);
    this.User = dbConnection.model(CONST.MODELS.USER);

    this.dropCollection = function (collection, callback) {
        dbConnection.collections[collection].drop(function (err) {
            if (err) {
                if (err.errmsg !== 'ns not found') {
                    return callback(err);
                }
            }
            callback();
        });
    };

    this.dropAllCollections = function (callback) {

        var collections = Object.keys(mongoose.connection.collections);

        async.forEach(collections, function (collectionName, done) {
            var collection = mongoose.connection.collections[collectionName];
            collection.drop(function (err) {
                if (err && err.message !== 'ns not found') {
                    callback(err);
                }
                callback();
            });
        }, callback);
    };

};

module.exports = PreparingDb;
