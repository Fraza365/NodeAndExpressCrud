const {Client,Pool} = require('pg');


const db = new Client({
    host     : 'ec2-34-200-116-132.compute-1.amazonaws.com',
    user     : 'zdhjbiamcezysx',
    password : 'cf506a4a4544af0d2760875fbb29a54566d794a054c798e52b8a6a5f5c6ceea0',
    database : 'd5ael86tl17shu'
  });

  module.exports = db;