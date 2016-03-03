var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config/web.config');
var routes = require('./config/routes');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../','node_modules')));
app.use(express.static(path.join(__dirname,'view')));

var port = process.env.port || 10002;
routes(app);
app.listen(port);
console.log('start experiment server on port '+port);