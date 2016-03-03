var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./config/routes');
var dbconfig = require('./config/db.config');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../','node_modules')));
app.use(express.static(path.join(__dirname,'view')));


mongoose.connect(dbconfig.db,dbconfig.db_option);
routes(app);
var port = process.env.port || dbconfig.LocalPort;
app.listen(port);
console.log(dbconfig.db);

module.exports = app;
console.log('start datashell server on port '+port)