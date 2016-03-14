'use strict';

module.exports = function (db) {

    require('./user')(db);
    require('./sessions')(db);
};
