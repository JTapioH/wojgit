'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password : '',
  port     : '3308', // Vertaisarvioija, vaihda tähän oman paikallisen kannan portti.
  database : 'jalkapallo'
});


module.exports = 
{
    fetchSeriesTable : function()
    {
        return new Promise((resolve, reject) => {

          connection.query('SELECT j.Nimi, s.Ottelumaara, s.Voittoja, s.Tappioita, s.Tasapeleja, s.Pisteet, (s.Tehdyt_maalit - s.Paastetyt_maalit) AS Maaliero FROM joukkue j JOIN sarjataulukko s  ON s.Joukkue_id = j.Id ORDER BY s.Pisteet DESC;', function(error, results, fields){
            if ( error ){
              console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
              reject("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
            }
            else
            {
              // Vertaisarvioija huom. tässä JSON muotoinen data tulostetaan consoliin, mutta ei viedä selaimeen, eli kuten tehtävänannossa pyydettiin.
              console.log("Data (rev) = " + JSON.stringify(results));
              resolve(results);
            }    
        })
      })
    },

    fetchTeams : function()
    {
        return new Promise((resolve, reject) => {

          connection.query('SELECT Nimi, Kaupunki from Joukkue;', function(error, results, fields){
            if ( error ){
              console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
              reject("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
            }
            else
            {
              console.log("Data (rev) = " + JSON.stringify(results));
              resolve(results);
            }    
        })
      })
    },

    fetchPlayers : function()
    {
        return new Promise((resolve, reject) => {

          connection.query('SELECT p.Sukunimi, p.Etunimi, j.Nimi AS Joukkue FROM pelaaja p JOIN joukkue j on p.Joukkue_id = j.Id;', function(error, results, fields){
            if ( error ){
              console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
              reject("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
            }
            else
            {
              console.log("Data (rev) = " + JSON.stringify(results));
              resolve(results);
            }    
        })
      })
    },
}
