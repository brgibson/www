// web.js
var express = require('express');
var logfmt = require('logfmt');
var app = express();

var index = require('./_modules/_controllers/index.js');

var mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.get('/', index.controller);
app.get('/index.html', index.controller);

app.use(logfmt.requestLogger());

app.use(express.static(__dirname + '/'));

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Listening on ' + port);
});

