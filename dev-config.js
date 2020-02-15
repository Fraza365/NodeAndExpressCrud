const {Client,Pool} = require('pg');


const db = new Client({
    host     : 'localhost',
    user     : 'postgres',
    password : '123',
    database : 'nodedb'
  });;

  module.exports = db;