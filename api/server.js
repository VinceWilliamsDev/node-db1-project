const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

const router = require('./accountsRoute')

server.use(express.json());

server.get('/', (req, res) => {
    res.json({message: 'server is working'})
})

server.use('/api/accounts', router)

module.exports = server;
