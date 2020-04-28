
// Asenna ensin express npm install express --save
// Asenna ensin cookie-parser npm install cookie-parser --save

var express = require('express');
var app = express();

var fs = require('fs');

var bodyParser = require('body-parser');
var customerController = require('./customerController');
let cookieParser = require('cookie-parser');

const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

let users = {
    userName : "Testi",
    loginTime : Date.now(),
    sessionId : 1234
}

app.use(express.static(__dirname + '/public'));

// Staattiset filut
// app.use(express.static('public'));

// REST API Asiakas
app.route('/Types')
    .get(customerController.fetchTypes);


app.route('/Asiakas')
    .get(customerController.fetchAll)
    .post(customerController.create);

app.route('/Asiakas/:id')
    .put(customerController.update)
    .delete(customerController.delete);

app.get('/login', (req, res) => {
    res.cookie("userData", users);
    res.send("Kayttaja lisatty");
});

app.get('/getuser', (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies);
});

app.get('/logout', (req, res) => {
    res.clearCookie("userData");
    res.send("Kayttaja poistettu");
});

app.get('/', function(request, response){
    fs.readFile("aloitus.html", function(err, data)  {
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(data);
        response.end;
    });
    /*
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Terve maailma"); */
});

app.get('/maali', function(request, response){
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Maalit 2-3"); 
});

app.route('/task')
    .get(function(request, response){
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end("Taskeja pukkaa");     
    })
    .post(function(request, response){
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end("Taskeja pukkaa postista myöskin");     
    });

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});

/*
app.listen(port, () => {
    console.log(`Server running AT http://${port}/`);
  });
*/  