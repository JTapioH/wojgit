/**
 * Tehtävä 50 ja 52 eli asiakas-tietokannan käsittely tapahtuu kansiosta front löytyvästä 
 * html-tiedostosta. Sen js-koodi löytyy myös samasta kansiosta. Tehtävä 51 kuva on pääkansiossa.
 * Tehtävät 53 ja 54 eli keksit on toteutettu keksit.html-tiedostossa.
 * 
 * Tee tehtävien tarkastamiseksi niin, että aukaise node.html ja keksit.html-tiedostot ja klikkaile sieltä
 * läpi tarvittavat ominaisuudet. Ja katso kuva toki myös.
 */


'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password: '',
  port     : '3308',
  database: 'asiakas'
});

module.exports =
{
  fetchTypes: function (req, res) {
    connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        //res.send(error);
        //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
        res.send({ "status": 500, "error": error, "response": null });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.json(results);
        //res.statusCode = 418;
        //res.send(results);
        //res.send({ "status": 768, "error": null, "response": results });
      }
    });

  },

  fetchAll: function (req, res) {
    var query = "SELECT avain, nimi, osoite, postinro, postitmp, luontipvm, asty_avain FROM asiakas WHERE 1=1";
    if (req.query.length != 0) {
      for (var key in req.query) {
        query += " AND " + key + " LIKE '" + req.query[key] + "%'";
      }
    }
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        res.send({ "status": 500, "error": error, "response": null });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.send(results);
      }
    });
  },

  create: function (req, res) {
    if (req.body.nimi == "" || req.body.osoite == "" || req.body.postinro == "" || req.body.postitmp == "" || req.body.asty_avain == "") {
      // res.send({ "status": "NOT OK", "error": "Jokin kenttä on tyhjä tai syötit vääränlaista dataa" });
      res.send("Täytä kaikki kentät jatkaaksesi.");
    }
    else {
      // Mieluummin ehkä näin kuin MySQL spesifisti INSERT INTO asiakas set ? rakenteella,
      // niin tätä voi käyttää muidenkin kantojen kanssa
      var sql = "INSERT INTO asiakas(NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) VALUES ('" + req.body.nimi + "', '" + req.body.osoite + "', '" + req.body.postinro + "', '" + req.body.postitmp + "', " + "CURDATE(), '" + req.body.asty_avain + "')";
      console.log("sql=" + sql);
      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Virhe lisätessä asiakasta: " + error);
          res.send({ "status": "Jokin kenttä on tyhjä tai syötit vääränlaista dataa", "error": error, "response": null });
        }
        else {
          res.send({ "status": 200, "error": "" });
        }
      });
    }
  },

  // Tehtövö 55 serverin päässä.
  update: function (req, res) {
    var sql = "UPDATE asiakas SET NIMI = '" + req.body.nimi + "', OSOITE = '" + req.body.osoite + "', POSTINRO = '" + req.body.postinro + "', POSTITMP = '" + req.body.postitmp + "'  WHERE AVAIN = " + req.body.Id + ";";
    console.log("sql=" + sql);
    connection.query(sql, function(error, results, fields) {
      if (error) {
        console.log("Virhe muuttaessa asiakkaan tietoja" + error)
      }
      else {
        console.log("Meni läpi.")
      }
    })
    console.log(req.body);
  },

  // Tehtävä 50
  delete: function (req, res) {
    // Client lähettää DELETE method:n
    var sql = "DELETE FROM asiakas WHERE avain = " + req.params.id;
    console.log("sql= " + sql);
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("Virhe poistettaessa asiakasta: " + error);
      } 
      else {
        console.log("Asiakas poistettiin.");
      }
      
    })

    console.log("Params = " + JSON.stringify(req.params));
    res.send("Kutsuttiin delete");
    
  }
}
