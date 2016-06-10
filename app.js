var bodyParser = require('body-parser');
var express = require('express');
var morgan = require('morgan');
var path = require('path');


var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json({strict: false, inflate: false, type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(path.join(__dirname, './public')));

require('./routes')(app);

module.exports = app;
