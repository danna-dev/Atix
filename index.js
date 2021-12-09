const app = require('./config/app');
const server = require('./config/server');
const cryptoMessage = require('./src/cryptoMessage')
const express = require('express');
const router = express.Router();
server.initServer();


router.post('/message', cryptoMessage);


app.use(router);