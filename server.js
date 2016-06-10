var config = require('./config/default.js');
var mongoose = require('mongoose');
var app = require('./app');
var db;

mongoose.connect(config.dbHost + '/' + config.dbName, config.dbConnectionOptions);
db = mongoose.connection;

db.on('error', function (err) {

    var logErr = err || 'db connection error';
    console.error(logErr);

    process.exit(1);
});

db.once('open', function callback() {
    app.listen(config.appPort, function () {
        console.log('Server have started successfully on port: ' + config.appPort + ' in ' + config.env + ' version');
    });
});

process.on('SIGINT', function () {
    db.close();
});
