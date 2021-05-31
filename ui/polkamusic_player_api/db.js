const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  // password: "pratikS@1405",
  // password: "titu5",
  password: "", // your local password
  database: "polkamusic",
});

module.exports = connection;
