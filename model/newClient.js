const { Client } = require("pg");
require("dotenv").config();

/**
 * create connection to SQL database
 * 1- define db parameters (user, port, password, ...)
 * 2- create a new connection using "new Client()" from pg library
 * 3- start the connection with the ".connect()" method from the new client
 */
getClient = async () => {
  const connectionData = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  };
  const newClient = new Client(connectionData);
  newClient.connect();
  return newClient;
};

module.exports = getClient;
