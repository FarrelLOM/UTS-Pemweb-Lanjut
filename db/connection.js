var mysql = require( "mysql" ) ;

var hostname = "ztoz1.h.filess.io" ;
var database = "PLNEnergy_splitfully" ;
var port = "61001" ;
var username = "PLNEnergy_splitfully" ;
var password = "91a7ca77deef8b1a3823015e2dd9e840f0aefb56" ;

var db = mysql.createConnection({ host: hostname, user: username, password, database, port, }) ;

db.connect(function (err) { if (err) throw err ;

 console.log("Connected!") ;

}) ;

db.query("SELECT 1+1").on("result", function (row) { console.log(row) ;

}) ;