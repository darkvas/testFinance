var express = require('express');
var UserHandler = require('../handlers/users');

module.exports = function (db) {

    var users = new UserHandler(db);
    var router = express.Router();

    router
        .route('/')
        .post(users.create)
        .get(users.getAll);

    router
        .route('/count')
        .get(users.getCount);

    router
        .route('/:id')
        .put(users.update)
        .get(users.getOne)
        .delete(users.delete);

    return router;
};
