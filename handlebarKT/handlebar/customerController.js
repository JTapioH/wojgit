'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password : '',
  port     : '3308',
  database : 'asiakas'
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var users = [];
users.push({ name: 'Matti' });
users.push({ name: 'Kalle' });
users.push({ name: 'Ville' });

module.exports = 
{
    fetchUsers: function(){
      return users;
    },

    fetchTypesRevised : function()
    {
        return new Promise((resolve, reject) => {

          connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function(error, results, fields){
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

    create: function(req, res){

        console.log("body (CREATE): " + JSON.stringify(req.body));
        let c = req.body;

        connection.query('INSERT INTO Asiakas (Nimi, Osoite, Postinro, Postitmp, Luontipvm, Asty_avain) VALUES (?, ?, ?, ?, CURDATE(), ?)', [c.Nimi, c.Osoite, c.Postinro, c.Postitmp, c.Asty_avain],
          function(error, results, fields){
          if ( error ){
            console.log("Virhe lisättäessä dataa Asiakas-tauluun, syy: " + error);
            res.send(error);
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 201;
            c.Avain = results.insertId;
            res.send(c);
          }
      });
    },

    delete : function (req, res) {
      console.log("body: " + JSON.stringify(req.body));
      console.log("params: " + JSON.stringify(req.params));
      let avain = req.params.id;

      connection.query('DELETE FROM Asiakas WHERE Avain=?', [avain],
        function(error, results, fields){
        if ( error ){
          console.log("Virhe poistettaessa dataa Asiakas-taulusta, syy: " + error);
          res.send(error);
        }
        else
        {
          console.log("Data (DELETE)= " + JSON.stringify(results));
          res.statusCode = 204; // No content
          res.send();
        }
    });
  }
}
