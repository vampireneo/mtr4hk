var express = require('express');
var app = express();

var config = require('data.json');
// app.all('*',function(req) {

//     console.log(arguments);
// });
app.get('/', function(req, res) {
    res.send(config);
});
var loadfactorData = require('loadfactor.json');

app.get('/loadfactor', function(req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    res.header('Access-Control-Allow-Origin',"*");
    res.send(loadfactorData);
});




app.listen(8020);