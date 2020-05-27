// npm install express
// npm install handlebars
// npm install consolidate

// Aloita syöttämällä selaimeen http://localhost:3003 ja siitä linkki footballiin.

var express = require('express');
var cons = require('consolidate');
var app = express();
var path = require('path');
var customerController = require('./customerController');
var footballController = require('./footballController');


// Tulosta konsoliin mahdolliset enginet
//console.log(cons);

app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


var usersFromServer = [];
usersFromServer.push({ name: 'Matti' });
usersFromServer.push({ name: 'Kalle' });
usersFromServer.push({ name: 'Ville' });

var customersFromServer = [];
customersFromServer.push({Nimi : "Testi", Osoite: "Testikuja 3", Postinro:"70700", Postitmp: "Kuopio", Tyyppi: "Hyvä"})

// Tulevat tapahtumat, tehtävä 56.
var tulevat = [];
tulevat.push({pvm: "20.4.2020", nimi: "Suomen Cup 1. kierros"});
tulevat.push({pvm: "16.5.2020", nimi: "Suomen Cup 2. kierros"});
tulevat.push({pvm: "26.5.2020", nimi: "Liigan avauskierros"});
tulevat.push({pvm: "31.5.2020", nimi: "Maajoukkuetauko"});


app.get('/', function(req, res) {
    res.render('index', {
      title: 'Hieno kilke',
      subtitle: 'Superupea'
    });
  });

app.get('/football', async function(req, res) {


  res.render('football', {
    valikko: ['Joukkeet', 'Ohjelma', 'Pistepörssi', 'Historia', 'Antidoping'],
    tulevatTapahtumat: tulevat,
    
  });
});

// Tehtävä 57 suoritus serverin päässä, katso myös footballcontrollerin fetchSeriesTable
app.get('/seriestable', async function(req, res) {
    var sarjataulu = null;

    try {
      sarjataulu = await footballController.fetchSeriesTable();
      console.log("Sarjataulukko haettu");
    }
    catch(error) {
      console.log("Ei onnistunut");
    }

    res.render('seriestable', {
      taulu: sarjataulu
    });
  });

  // Tehtävä 58 suoritus serverin päässä, katso myös footballControllerin fetchPlayers ja fetchTeams
  app.get('/playerandteams', async function(req, res) {
    // Tänne kilkkeet footballControllerista ennen renderöintiä
    var joukkueet = null;
    var pelaajat = null;

    try {
      joukkueet = await footballController.fetchTeams();
      console.log("Joukkueet haettu");
    }
    catch(error) {
      console.log("Ei onnistunut");
    }

    try {
      pelaajat = await footballController.fetchPlayers();
      console.log("Pelaajat haettu");
    }
    catch(error) {
      console.log("ei onnistunut");
    }

    res.render('playerandteams', {
      teams: joukkueet,
      players: pelaajat
    });
  });

  app.get('/customers', function(req, res) {
    res.render('customers', {
      customers: customersFromServer
    });
  });
    
app.get('/users', async function(req, res) {

    var types = null;
    try {
        types = await customerController.fetchTypesRevised();
        console.log("tyypit haettu");
    }
    catch(error){
        console.log("EI onnistunut");
    }
    if ( types == null ) types = [{ Avain:-1, Lyhenne: "KAIKKI", Selite: "Tyhyjä" }];
        res.render('users', {
            title: 'Hae käyttäjiä',
            subtitle: 'best',
            users: usersFromServer,
            languages: ['englanti', 'suomi', 'ruotsi'],
            types : types,
            testi : 'hyi mut ai'
        });       

    /*
    customerController.fetchTypesRevised().then(function(data){
        console.log("types = " + JSON.stringify(data));
        return data;    
    })
    .then((types) => {
        return types;
    })
    .catch(function(msg){
        console.log("Virhettä pukkaa " + msg);
    })
    .then((types) => {
        // suoritetaan vaikka tulis virhe
        if ( types == null ) types = [{ Avain:-1, Lyhenne: "KAIKKI", Selite: "Tyhyjä" }];
        res.render('users', {
            title: 'Users',
            subtitle: 'best',
            users: customerController.fetchUsers,
            languages: ['englanti', 'suomi', 'ruotsi'],
            types : types
        });        
    });
    */
});

app.listen(3003);
console.log('Express server listening on port 3003');

