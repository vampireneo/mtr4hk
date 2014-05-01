var express = require('express');
var app = express();

var config = require('data.json');
app.get('/', function(req, res) {
    res.send(config);
});



app.listen(80);