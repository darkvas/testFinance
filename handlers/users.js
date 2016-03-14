var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var UserHandler = function (db) {

    // var async = require('async');
    var User = db.model(CONST.MODELS.USER);
    var crypto = require('crypto');

    function isDuplicateMongoError(err, fieldName) {
        var RegDupField;
        var isDup;

        if (err.name === 'MongoError') {
            RegDupField = new RegExp('.+duplicate.+' + fieldName + '.*');
            isDup = RegDupField.test(err.message);
            return isDup;
        }
        return false;
    }

    this.create = function (req, res, next) {

        var email = req.body.email;
        var pass = req.body.pass;
        var err;
        var shaSum;
        var userData;
        var user;

        if (!email || !pass) {
            err = new Error(RESPONSE.NOT_ENOUGH_PARAMS);
            err.status = 400;
            return next(err);
        }

        shaSum = crypto.createHash('sha256');
        shaSum.update(pass);
        pass = shaSum.digest('hex');

        userData = {
            email   : email,
            pass    : pass,
            userType: CONST.USER_ROLE.CLIENT
        };

        User
            .findOne({email: userData.email})
            .exec(function (err, model) {
                if (err) {
                    return next(err);
                }
                if (model) {
                    return res.status(400).send({error: 'Email is used'});
                }

                user = new User(userData);
                user
                    .save(userData, function (err, userModel) {
                        if (err) {
                            if (isDuplicateMongoError(err, 'email')) {
                                return res.status(400).send({error: 'Email is used'});
                            }
                            return next(err);
                        }

                        res.status(201).send(userModel);
                    });
            });
    };

    this.getAll = function (req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var sortOrder = {};
        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;

        sortOrder[sortField] = sortDirection;

        User
            .find({})
            // .select('email userType devices profile accounts')
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(collection);
            });
    };

    this.getCount = function (req, res, next) {

        User
            .count({}, function (err, count) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send({count: count});
            });
    };

    this.update = function (req, res, next) {

        var userId = req.params.id;

        // TODO Validate input data
        var userData = req.body;

        User
            .update({_id: userId}, {$set: userData}, function (err, data) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send(data);
            });
    };

    this.getOne = function (req, res, next) {

        var userId = req.params.id;

        User
            .findOne({_id: userId})
            // .select( 'login userType devices profile favorites accounts')
            .exec(function (err, model) {
                if (err) {
                    return next(err);
                }
                if (!model) {
                    return res.status(404).send({error: RESPONSE.ON_ACTION.NOT_FOUND + ' with such _id: ' + userId});
                }
                return res.status(200).send(model);
            });
    };

    this.delete = function (req, res, next) {

        var userId = req.params.id;

        User
            .findOne({_id: userId})
            .remove()
            .exec(function (err) {

                if (err) {
                    return next(err);
                }

                return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
            });
    };
};

module.exports = UserHandler;
